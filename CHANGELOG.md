# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## v0.13.0

### Changed

- **Breaking:** Client wire shapes now align with Medrunner API v0.13 while preserving existing client type and enum names for the same API resources.
- **Breaking:** Required nullable wire fields are represented as `T | null`, and counts or limits that can be serialized as strings are represented as `number | string`.

### Removed

- **Breaking:** `LocationDetail` and its limited `LocationType` have been removed.
