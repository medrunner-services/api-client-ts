# Error handling

## Introduction

The Medrunner API uses HTTP status codes to indicate success or failure of an API call. Status codes in the 2xx range means success, 4xx range means there was an error in the provided information, and those in the 5xx range indicate server side errors.

## Default error response

For most endpoints, when an error occur the API will return a status code in the 4xx or 5xx range, and it is up to you to understand where the error comes from following the [RFC 9110](https://httpwg.org/specs/rfc9110.html#overview.of.status.codes) spec. You can use this article from MDN to understand the [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses).

## Detailed error response

In some cases, multiple situations can cause a wide range of errors resulting in different errors using the status code. In those cases, the API will return a JSON object containing a dedicated error code and a message to help you understand the error. Some endpoints will even have additional fields in the response body to give you the best ability to handle the error.

```json
{
  "code": 1002,
  "message": "Team already has a leader.",

  // Additional fields
  "conflicting_user_id": "1234567890"
}
```

::: info
List of custom error codes and additional fields for each endpoint can be found in the documentation of each individual endpoint.
:::
