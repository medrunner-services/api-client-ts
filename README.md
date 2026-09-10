# Medrunner API Client

This TypeScript library acts as an official client for the Medrunner API.

Learn more at [medrunner.dev](https://medrunner.dev)!

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and breaking changes.

## Getting Started

```ts
import { MedrunnerApiClient } from "@medrunner/api-client";

const apiConfig = {
  baseUrl: "https://api.medrunner.space",
  refreshToken: "YOUR_API_TOKEN",
};

const api = MedrunnerApiClient.buildClient(apiConfig);
const self = await api.client.get();

console.log(self);
```

## OIDC client credentials

Use `OidcClientCredentialsTokenProvider` when a service obtains bearer tokens through the OAuth 2.0 client-credentials grant.
The provider caches tokens and supports a deliberately scoped `openidClient` boundary for discovery and token-grant interoperability.

```ts
import { OidcClientCredentialsTokenProvider } from "@medrunner/api-client";

const accessTokenProvider = new OidcClientCredentialsTokenProvider({
  issuer: new URL("https://identity.example.test/application/o/medrunner/"),
  clientId: "service-client",
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  scopes: ["client:read"],
  openidClient: {
    discoveryAlgorithm: "oidc",
    timeoutSeconds: 10,
    additionalTokenParameters: {
      resource: "https://api.example.test",
    },
  },
});
```

`openidClient.allowInsecureRequests` permits HTTP for both discovery and token requests.
Use it only for local development or tests because it disables the normal HTTPS-only protection.

`customFetch`, `useMtlsEndpointAliases`, and `clientAuthentication` support advanced proxy, mutual-TLS, and non-Basic client-authentication deployments.
When supplying `clientAuthentication`, `clientSecret` is optional.

Additional token parameters may contain standard settings such as `resource` and provider extensions such as `audience`.
The provider rejects `scope`, `grant_type`, and client-authentication parameters because it owns those values.

### Authentik global issuer mode

Authentik normally derives a provider-specific issuer, which the default OIDC discovery convention handles automatically.
In global issuer mode, its issuer is the instance root while its discovery document remains provider-specific.
Configure both values explicitly in that case.

```ts
const accessTokenProvider = new OidcClientCredentialsTokenProvider({
  issuer: new URL("https://auth.example.test/"),
  clientId: "bot-med",
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  scopes: ["client:read"],
  openidClient: {
    discoveryDocumentUrl: new URL("https://auth.example.test/application/o/bot-med/.well-known/openid-configuration"),
  },
});
```

The provider verifies that the discovery document advertises the configured issuer before requesting a token.
Do not combine `discoveryDocumentUrl` with `discoveryAlgorithm` because an explicit document URL does not require derivation.

## Creating a new package version

Follow these steps to publish a new version of the package:

- Merge your changes into the `main` branch with a pull request
- Create a new github release and a new tag at the same time in the UI
  - In the case of a beta release:
    - the tag name should be `v1.0.0-beta.1`, where the version number should match the package.json version and the beta number simply increments from beta releases of this same version.
    - set the github release as a pre-release
  - In the case of a stable release:
    - the tag name should be `v1.0.0`, where the version number should match the package.json version.
- The package will be published with the new version once the release is published.

The package will not publish if the release information and package version do not match:

- If the release tag has a different version than the package.json version, without taking into account the tags, the package will not be published.
- If the release tag contains the tag `beta` but the github release is not marked as a pre-release, the package will not be published.
- If the release is stable but the github release is marked as a pre-release, the package will not be published.
