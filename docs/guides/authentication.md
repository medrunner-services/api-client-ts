# Authentication guide

## Introduction

The Medrunner API uses two methods of authentication: API keys and Discord OAuth2. API keys are used for server-to-server communication, while Discord OAuth2 is used for user authentication.

## API keys

To generate an API key, go to the [API Tokens section in your profile](https://portal.medrunner.space/profile) and click the "Create Token" button. You can provide a name for the key (Only used for your reference) and an optional expiration date. Once you click "Create", the key will be generated and displayed to you. You can then see all your keys in the table, indicating when they where last used and when they expire. You can delete a token if it is not in use anymore by clicking the trash icon.

The API key is in reality a permanent refresh token, meaning you cannot use it directly to authenticate API calls. You first need to exchange it for an access token, follow the [Authenticate API calls](/guides/authentication#authenticate-api-calls) section for detailed steps.

::: info
Make sure to copy the generated key and store it in a safe place, as it will not be possible to see it again.
:::

## Discord OAuth2

To authenticate users, the Medrunner API uses Discord OAuth2. This allows users to log in using their Discord account, and then you can get the Medrunner API tokens related to the discord account of the user.

To get your first refresh tokens, you need to start by redirecting the user to the discord login page. You should then pass your discord client id and the redirect_url parameter (that should be the url where your application is). Discord sends back a code as a get request to the CALLBACK_URL provided.

```ts
window.location.replace(
  `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${CALLBACK_URL}/auth/register`,
);
```

Once you have the discord code, you can exchange it for the refresh token by making a POST request to the Medrunner API at the `/auth/signin` endpoint with the discord code as the `code` parameter, and the CALLBACK_URL you used in the discord request as the `redirectUri` parameter.

```ts
await axios.get(`https://api.medrunner.space/auth/signin?code=${DISCORD_CODE}&redirectUri=${CALLBACK_URL}/auth`);
```

::: warning
Make sure to use the exact same CALLBACK_URL you used in the discord request, otherwise the request will fail.
:::

To authenticate API calls, you now need to exchange it for an access token, follow the [Authenticate API calls](/guides/authentication#authenticate-api-calls) section for detailed steps.

## Authenticate API calls

### Use the TypeScript client

The easiest way to authenticate API calls is to use the TypeScript client provided by Medrunner. The client will handle the authentication for you, so you don't have to worry about it.

To use the client, you need to initialize it with your API key or refresh token:

```ts
import MedrunnerApiClient from "@medrunner/api-client";

const apiConfig = {
  baseUrl: "https://api.medrunner.space",
  token: "YOUR_REFRESH_TOKEN",
};

const refreshCallback = async newTokens => {
  localStorage.setItem("refreshToken", newTokens.refreshToken);
};

const api = MedrunnerApiClient.buildClient(apiConfig, refreshCallback());
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
