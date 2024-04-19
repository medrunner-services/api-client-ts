# Getting started

## Introduction

The Medrunner API allows you to perform all the operations that you do with our web client. It is built using REST principles which ensures predictable URLs that makes writing applications easy. This API follows HTTP rules, enabling a wide range of HTTP clients which can be used to interact with the API. Every resource is exposed as a URL.

The base URL for the API is:

```
https://api.medrunner.space/
```

## TypeScript Client

### Initialize the client

To make it easier to interact with the Medrunner API, we provide a TypeScript client that you can use in your projects. The client is available on npm and can be installed using the following command:

```bash
npm i @medrunner/api-client
```

Once installed, the client will provide you with methods to call API endpoints. Each method will provide you the type of the body and the response.
The client will also handle authentication for you, so you don't have to worry about it.

Here is an example of how to configure the client:

```ts
import MedrunnerApiClient from "@medrunner/api-client";

const apiConfig = {
  baseUrl: "https://api.medrunner.space",
  token: "YOUR_REFRESH_TOKEN",
};

const api = MedrunnerApiClient.buildClient(apiConfig);
```

::: info
The refreshCallback is a function that will be called every time the client refreshes the access token. You can use it to store the new tokens in your application for exemple.
:::

Now that you have configured the client, you can start making API calls. Here is an example of how to get the current user:

```ts
const self = await api.client.get();

console.log(self);
```

You can find all the available methods and their associated types [here](/reference/).

### Use the built-in logger

## API Call Limits

API calls are limited to provide better quality of service and availability to all the users. There are some default limits that apply for all endpoint, but some specific endpoints have more restrictive limits.

#### Default limits

| Limit | Period     |
| ----- | ---------- |
| 15    | per second |
| 50    | per minute |
| 500   | per hour   |

#### Specific limits

| Methods | Endpoint        | Limit | Period        |
| ------- | --------------- | ----- | ------------- |
| POST    | /emergency      | 3     | per minute    |
| POST    | /emergency      | 6     | per hour      |
| POST    | /client/link    | 3     | per minute    |
| POST    | /client/link    | 100   | per day       |
| POST    | /auth/apiTokens | 1     | per 5 seconds |
| POST    | /auth/apiTokens | 5     | per minute    |
