import {
  type Attributes,
  context,
  type Counter,
  type Histogram,
  type MeterProvider,
  metrics,
  type Span,
  SpanKind,
  SpanStatusCode,
  trace,
} from "@opentelemetry/api";

import { ApiRequestFailure, ApiRequestMethod } from "../ApiRequestFailureLogger";

const instrumentationName = "@medrunner/api-client";
const requestDurationMetricName = "medrunner.api.client.request.duration";
const requestFailureMetricName = "medrunner.api.client.request.failures";
const requestRetryMetricName = "medrunner.api.client.request.retries";

let activeMeterProvider: MeterProvider | undefined;
let activeInstruments: ApiRequestMetrics | undefined;

/** The bounded operation dimensions shared by spans and metrics. */
export interface ApiRequestTelemetryContext {
  endpoint: string;
  method: ApiRequestMethod;
  serverAddress?: string;
}

/** Records the lifecycle of one logical API request without configuring an OpenTelemetry SDK. */
export default class ApiRequestTelemetry {
  private readonly span: Span;
  private readonly startedAt = Date.now();
  private retryCount = 0;

  public constructor(private readonly request: ApiRequestTelemetryContext) {
    this.span = trace.getTracer(instrumentationName).startSpan("medrunner.api.request", {
      kind: SpanKind.INTERNAL,
      attributes: requestAttributes(request),
    });
  }

  /** Executes an operation with the logical request span active for child HTTP instrumentation. */
  public async run<T>(operation: () => Promise<T>): Promise<T> {
    return await context.with(trace.setSpan(context.active(), this.span), operation);
  }

  /** Records the single supported authentication recovery attempt. */
  public recordAuthenticationRetry(): void {
    this.retryCount += 1;
    metricInstruments().retries.add(1, requestAttributes(this.request));
  }

  /** Records a successful terminal response for the logical request. */
  public recordSuccess(statusCode: number): void {
    const attributes = outcomeAttributes(this.request, statusCode, this.retryCount);
    this.span.setAttributes(attributes);
    metricInstruments().duration.record(this.durationSeconds(), attributes);
  }

  /** Records a sanitized terminal failure without capturing the raw Axios error object. */
  public recordFailure(failure: ApiRequestFailure): void {
    const errorType = failure.statusCode === undefined ? "transport" : "http.response";
    const attributes = outcomeAttributes(this.request, failure.statusCode, failure.retryCount, errorType);
    this.span.setAttributes(attributes);
    this.span.setStatus({ code: SpanStatusCode.ERROR });
    this.span.addEvent("exception", {
      "exception.type": errorType,
    });

    const instruments = metricInstruments();
    instruments.duration.record(this.durationSeconds(), attributes);
    instruments.failures.add(1, attributes);
  }

  /** Ends the logical request span after the response has been logged. */
  public end(): void {
    this.span.end();
  }

  /** Exposes the current retry count to terminal failure records. */
  public getRetryCount(): number {
    return this.retryCount;
  }

  private durationSeconds(): number {
    return Math.max(0, (Date.now() - this.startedAt) / 1000);
  }
}

/** The stable instruments reused while the global MeterProvider remains unchanged. */
interface ApiRequestMetrics {
  duration: Histogram;
  failures: Counter;
  retries: Counter;
}

/** Recreates instruments only when a downstream application replaces the global MeterProvider. */
function metricInstruments(): ApiRequestMetrics {
  const meterProvider = metrics.getMeterProvider();
  if (activeMeterProvider !== meterProvider || activeInstruments === undefined) {
    const meter = meterProvider.getMeter(instrumentationName);
    activeMeterProvider = meterProvider;
    activeInstruments = {
      duration: meter.createHistogram(requestDurationMetricName, { unit: "s" }),
      failures: meter.createCounter(requestFailureMetricName, { unit: "{request}" }),
      retries: meter.createCounter(requestRetryMetricName, { unit: "{retry}" }),
    };
  }

  return activeInstruments;
}

/** Builds bounded attributes that are valid for metrics and trace spans. */
function requestAttributes(request: ApiRequestTelemetryContext): Attributes {
  const attributes: Attributes = {
    "medrunner.api.endpoint": request.endpoint,
    "http.request.method": request.method,
  };

  if (request.serverAddress !== undefined) {
    attributes["server.address"] = request.serverAddress;
  }

  return attributes;
}

/** Adds the terminal response fields without including URL paths or response content. */
function outcomeAttributes(
  request: ApiRequestTelemetryContext,
  statusCode: number | undefined,
  retryCount: number,
  errorType?: string,
): Attributes {
  const attributes: Attributes = {
    ...requestAttributes(request),
    "medrunner.api.retry_count": retryCount,
  };

  if (statusCode !== undefined) {
    attributes["http.response.status_code"] = statusCode;
  }

  if (errorType !== undefined) {
    attributes["error.type"] = errorType;
  }

  return attributes;
}
