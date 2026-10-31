import eventSchemas from "../../openapi/events.json";
import { eventValidators, routes } from "./generated/catalog";
import type { EventPayloads } from "./generated/events";
import * as validators from "./generated/validators";
import type { components, paths } from "./generated/wire";

/** The generated wire types distinguish required nullable fields from optional request fields. */
export type WireComponents = components;
export type WirePaths = paths;

/** A contract failure contains schema paths, never the response body or credentials. */
export class ApiContractError extends Error {
  constructor(
    public readonly contract: string,
    public readonly fieldPath: string,
    public readonly keyword: string,
  ) {
    super(`API contract ${contract} failed at ${fieldPath || "/"} (${keyword})`);
    this.name = "ApiContractError";
  }
}

/** Checks a documented successful HTTP response before exposing it as a typed value. */
export function assertHttpResponse(method: string, path: string, status: number, value: unknown): void {
  const route = findRoute(method, path);
  // ApiEndpoint is extensible; custom endpoints outside the bundled API need their own contracts.
  if (route === undefined) {
    assertCustomRoute(path);
    return;
  }
  const responses: Readonly<Record<string, string | null>> = route.responses;
  if (!(String(status) in responses)) throw new ApiContractError(`${method} ${route.path}`, "/", "status");
  const validator = responses[String(status)];
  if (validator != null) validate(validator, value, `${method} ${route.path}`);
}

/** Checks request bodies using their separate optionality rules. */
export function assertHttpRequest(method: string, path: string, value: unknown): void {
  const route = findRoute(method, path);
  if (route === undefined) {
    assertCustomRoute(path);
    return;
  }
  if (route.request === null) return;
  if (value === undefined && !route.requestRequired) return;
  validate(route.request, value, `${method} ${route.path} request`);
}

/** Validates a complete event snapshot. Only the legacy queue path opts into omitted-null restoration. */
export type { EventPayloads } from "./generated/events";

export function parseEvent<N extends keyof EventPayloads>(
  name: N,
  value: unknown,
  legacyOmittedNulls = false,
): EventPayloads[N] {
  const normalized = legacyOmittedNulls ? restoreLegacyNulls(value, eventSchemas[name], eventSchemas[name]) : value;
  validate(eventValidators[name], normalized, `${name} event`);
  // This is the sole conversion after schema validation, never a cast of unchecked transport data.
  return normalized as EventPayloads[N];
}

function validate(name: string, value: unknown, contract: string): void {
  const validator = validators[name as keyof typeof validators];
  if (validator === undefined) throw new ApiContractError(contract, "/", "schema");
  if (!validator(value)) {
    const failure = validator.errors?.[0];
    const missing = failure?.keyword === "required" ? `/${String(failure.params.missingProperty)}` : "";
    throw new ApiContractError(contract, `${failure?.instancePath ?? ""}${missing}`, failure?.keyword ?? "schema");
  }
}

function findRoute(method: string, path: string): (typeof routes)[number] | undefined {
  const pathname = path.split("?")[0].replace(/\/$/, "") || "/";
  return routes.find(
    route =>
      route.method === method.toUpperCase() &&
      new RegExp(
        `^${route.path
          .split("/")
          .map(part => (part.startsWith("{") ? "[^/]+" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
          .join("/")}/?$`,
        "i",
      ).test(pathname),
  );
}

type Schema = {
  type?: string | string[];
  $ref?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  anyOf?: Schema[];
  oneOf?: Schema[];
};

/** Restores only historically omitted nullable properties; required non-null fields are never invented. */
function restoreLegacyNulls(value: unknown, schemaValue: unknown, root: unknown): unknown {
  let schema = schemaValue as Schema;
  if (schema.$ref?.startsWith("#/")) {
    schema = schema.$ref
      .slice(2)
      .split("/")
      .reduce<unknown>(
        (node, key) => (node as Record<string, unknown>)[key.replaceAll("~1", "/").replaceAll("~0", "~")],
        root,
      ) as Schema;
  }
  for (const branch of schema.anyOf ?? schema.oneOf ?? []) {
    if (branch.type !== "null") value = restoreLegacyNulls(value, branch, root);
  }
  if (Array.isArray(value) && schema.items !== undefined)
    return value.map(item => restoreLegacyNulls(item, schema.items, root));
  if (typeof value !== "object" || value === null || Array.isArray(value)) return value;
  const result: Record<string, unknown> = { ...value };
  for (const [key, property] of Object.entries(schema.properties ?? {})) {
    if (!Object.hasOwn(result, key) && allowsNull(property)) result[key] = null;
    else if (Object.hasOwn(result, key)) result[key] = restoreLegacyNulls(result[key], property, root);
  }
  return result;
}

function allowsNull(schema: Schema): boolean {
  return (
    schema.type === "null" ||
    (Array.isArray(schema.type) && schema.type.includes("null")) ||
    (schema.anyOf ?? schema.oneOf ?? []).some(allowsNull)
  );
}

/** Validates authentication responses even when a portal performs the initial cookie sign-in with fetch. */
export function parseTokenGrant(value: unknown): components["schemas"]["TokenPair"] {
  assertHttpResponse("POST", "/auth/exchange", 200, value);
  return value as components["schemas"]["TokenPair"];
}

function assertCustomRoute(path: string): void {
  const prefix = path.split("/")[1]?.toLowerCase();
  if (routes.some(route => route.path.split("/")[1]?.toLowerCase() === prefix)) {
    throw new ApiContractError("HTTP operation", "/", "undocumented-operation");
  }
}
