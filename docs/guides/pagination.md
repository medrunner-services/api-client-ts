# Pagination

## Introduction

The Medrunner API provides endpoints to retrieve lists of resources that sends back a delimited number of items with the ability to request the following items. This is often used in endpoints that return a potentially very long list of items like past emergencies for a user or the chat messages in an emergency.

## Using Paginated Responses

While using the API client you will see that certain methods returns the type of the response wrapped in a `PaginatedResponse` type. This means that the response is paginated, and you can request more items by using the `paginationToken` provided and sending it back along in the next request.

In a paginated response, the array of returned items is wrapped in a `data` key, so you need to first access the response body of the request (`response.data`), then the data field of the response body itself (`response.data.data`).

```json
{
  "data": [],
  "paginationToken": "THE_PAGINATION_TOKEN"
}
```

The pagination token is a string that when sent to the same endpoint will allow the API to send you back the next set of items depending on the limit you've set.

::: warning
The pagination token will always be set even if there is no more data to retrieve, in this case, the data array will be empty.
:::
