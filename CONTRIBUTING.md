# Medrunner API Client Contributing Guide

We're really excited that you are interested in contributing to the Medrunner API Client. Before submitting your contribution, please make sure to take a moment and read through the [Code of Conduct](https://github.com/medrunner-services/api-client-ts/blob/main/CODE_OF_CONDUCT.md).

## Contributing by creating issues

The simplest and easiest way to contribute to the project is to create an issue. You can report bugs, request features, or suggest improvements. This way we know what is important for you and we can work on it faster!

When creating an issue, be sure to provide the maximum amount of information and context so that we can understand the problem or the suggestion. If you are reporting a bug, please provide the environnement where the bug occurred and a way to reproduce it.

## Contributing by creating pull requests

If you want to directly contribute to the project by adding or fixing some code, you can create a pull request with your desired changes. Here are some guidelines to follow:

- Fork the repository into your own account.

- Checkout a topic branch from `main` with a name like `feature/adding-types` or `bug/docs-images-error`.

- Make sure to run `pnpm run lint:fix` and `pnpm run prettier:fix` before committing your changes. You can even enable GitHub actions in your forked repository to run these checks automatically.

- Create a pull request with your changes from your feature branch against the `main` branch.

- If adding a new feature:
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing a bug:
  - Provide a detailed description of the bug in the PR. Live demo preferred.

- It's OK to have multiple small commits as you work on the PR - all PRs will be squash merged.

When we receive a pull request, we will review it and provide feedback. If everything is good, we will merge it into the main branch.

## Development Setup

You will need [node](https://nodejs.org/)

After cloning the repo, run:

```sh
# install the dependencies of the project
$ pnpm install
```

### Working on the api-client package

You can now start working on the project. To test if everything works correctly, you can build the package:

```sh
# build the package and the documentation website
$ pnpm run build
```

To test if your changes to the package work correctly, you can use the [pnpm link](https://pnpm.io/cli/link) feature and link the package to a test project.
