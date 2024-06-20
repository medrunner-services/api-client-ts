# Medrunner API Client
This typescript library acts as a client for the Medrunner API.

## Getting Started

```ts
import MedrunnerApiClient from "@medrunner/api-client";

const apiConfig = {
  baseUrl: "https://api.medrunner.space",
  refreshToken: "YOUR_API_TOKEN",
};

const api = MedrunnerApiClient.buildClient(apiConfig);
const self = await api.client.get();

console.log(self)
```
