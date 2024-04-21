# Error handling

## Introduction

The Medrunner API uses HTTP status codes to indicate success or failure of an API call. Status codes in the 2xx range means success, 4xx range means there was an error in the provided information, and those in the 5xx range indicate server side errors.

## Default error response

When an error occur the API will return a status code in the 4xx or 5xx range, and it is up to you to understand where the error comes from following the [RFC 9110](https://httpwg.org/specs/rfc9110.html#overview.of.status.codes) spec. You can use this article from MDN to understand the [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses).
