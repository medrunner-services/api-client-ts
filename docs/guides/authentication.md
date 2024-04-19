# Authentication guide

## Introduction

The Medrunner API uses to authenticate users. They should be used for server-to-server communication.

## API keys

To generate an API key, go to the [API Tokens section in your profile](https://portal.medrunner.space/profile) and click the "Create Token" button. You can provide a name for the key (Only used for your reference) and an optional expiration date. Once you click "Create", the key will be generated and displayed to you. You can then see all your keys in the table, indicating when they where last used and when they expire. You can delete a token if it is not in use anymore by clicking the trash icon.

The API key is in reality a permanent refresh token, meaning you cannot use it directly to authenticate API calls. You first need to exchange it for an access token, follow the [Authenticate API calls](/guides/authentication#authenticate-api-calls) section for detailed steps.

::: info
Make sure to copy the generated key and store it in a safe place, as it will not be possible to see it again.
:::

## Authenticate API calls

### Use the TypeScript client

The easiest way to authenticate API calls is to use the TypeScript client provided by Medrunner. The client will handle the authentication for you, so you don't have to worry about it.

To use the client, you need to initialize it with your API key:

```ts
import MedrunnerApiClient from "@medrunner/api-client";

const apiConfig = {
  baseUrl: "https://api.medrunner.space",
  token: "YOUR_API_KEY",
};

const api = MedrunnerApiClient.buildClient(apiConfig);
```

::: info
The refreshCallback is a function that will be called every time the client refreshes the access token. You can use it to store the new tokens in your application for exemple.
:::

### Make API calls

You can now use the client to make API calls. Here is an example of how to get the current user:

```ts
const self = await api.client.get();

console.log(self);
```
