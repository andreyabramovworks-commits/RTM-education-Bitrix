# Architecture Decisions

### ADR-001: Functional runtime modules replace release patch layers

- Date: 2026-08-06
- Status: accepted
- Supersedes: runtime loading of `v037` through `v5100` files.

#### Context

The application accumulated version-numbered JavaScript and CSS files. Their implicit ordering caused duplicated manifests, cascading style overrides and competing initialization paths.

#### Decision

The v51.3.0 runtime uses one manifest and permanent modules named by responsibility: core, API, learning, knowledge, acknowledgements and canvas. Release numbers live only in metadata and Git tags. Rollback uses Git history rather than retained UI layers.

#### Reasons

- One source of runtime order.
- Stable ownership of behavior and styles.
- Fewer network requests and no duplicate standalone manifest.
- Future fixes change the responsible module instead of adding a new version file.

#### Consequences

- Positive: deterministic loading and easier maintenance.
- Negative: functional bundles remain order-dependent while legacy globals are gradually retired.
- Risks: moving code between modules without preserving order can break global consumers.

#### Change restriction

Do not create new version-numbered JavaScript or CSS patch files. A change to module boundaries requires a new architecture decision and runtime tests.

### ADR-002: Initialization and synchronization are single-flight

- Date: 2026-08-06
- Status: accepted

#### Context

The API adapter and application bootstrap could independently trigger initial synchronization.

#### Decision

Only the application initializer starts the first load. Concurrent callers share the same initialization and synchronization promises.

#### Change restriction

Do not add delayed or observer-driven fallback calls to `loadAll()`.

### ADR-003: The React host owns runtime startup

- Date: 2026-08-06
- Status: accepted

#### Context

Functional scripts share legacy global contracts, but some release-era modules previously started themselves while later modules were still loading. Once the scripts were consolidated, an early shell callback entered the temporal dead zone of the core `state` binding and stopped the application before API synchronization and theme loading.

#### Decision

`LegacyReactHost.jsx` prepares required browser globals, loads every functional runtime asset in manifest order, and only then invokes the shell initializer and the single application initializer. Functional modules expose behavior but never start the application as a side effect of loading.

#### Change restriction

Do not call `__RTM_V48_INIT__`, `loadAll()` or an equivalent startup fallback from a functional runtime module. Startup ordering belongs exclusively to the React host and must remain regression-tested.
