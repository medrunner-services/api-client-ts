# Identity lookup failures

The API preserves authoritative handle spelling while resolving handle and organization identifiers using its versioned column collation.
Callers supply identifiers rather than lowercase database keys; successful responses retain the provider spelling.

| Optional `problemDetails.reason` | Domain meaning |
|---|---|
| `staff_not_found` | No eligible staff identity matched; affected team operations return 404. |
| `team_not_found` | The requested team is missing; affected team operations return 404. |
| `identity_ambiguous` | Multiple eligible identities matched; authorized domain operations return 409. |

The normalizer preserves bounded string reasons and existing request/trace identifiers while keeping numeric `errorCode` behavior unchanged.
Consumers should provide a generic fallback for absent or unknown reasons and should not parse the human-readable error title.
Older reasonless 404s cannot reliably distinguish a missing team from a missing handle.
Authentication failures retain their existing safe public response and do not reveal matching account records.
