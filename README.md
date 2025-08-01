# Medrunner API Client

This typescript library acts as a client for the Medrunner API.

Learn more at [medrunner.dev](https://medrunner.dev)!

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
