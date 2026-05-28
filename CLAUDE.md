# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@drumee/server-essentials** is a core npm package providing essential backend infrastructure for Drumee server services. Changes here have broad impact — this library is shared across all Drumee backend services.

- **Package**: @drumee/server-essentials (npm)
- **Main entry**: `lib/index.js`
- **License**: AGPL V3

## Commands

```bash
npm install

# Individual tests (npm test itself fails — it references test:cache which doesn't exist)
npm run test:db
npm run test:email
npm run test:template
npm run test:crypto
npm run test:modules     # cache/module loading test

# Show system state
npm run show:cache
npm run show:sysEnv

# Release: push to git, publish to npm, increment patch version
npm run release
```

## Architecture

### Module Initialization & Singletons

`lib/index.js` is the sole public entry point. Two global singletons are initialized there and must not be created elsewhere:
- `global.DrumeeSharedCache` — the `DrumeeCache` instance
- `global.SharedRedisStore` — the `RedisStore` instance

If already initialized, the existing global is reused. This prevents duplicate connections when the package is required multiple times across a service.

### Configuration Cascade

All config modules follow the same precedence (see `lib/configs.js`, `lib/sysEnv.js`, `lib/redis-store.js`):
1. Endpoint-specific: `/etc/drumee/credential/{endpoint_name}/{file}.json`
2. Default system: `/etc/drumee/credential/{file}.json`
3. Hardcoded socket path fallback

The active endpoint is `sysEnv().endpoint_name`, resolved from `process.env.route` then the config file then `'main'`. When `endpoint_name` is `'main'`, the default path is used.

### Logging Base Class

All major classes extend `Logger` (`lib/logger.js`), which extends `Backbone.Model` (not EventEmitter). New classes should extend `Logger`.

The logger provides levelled output: `error`, `warn`, `notice`, `debug`, `verbose`, `silly`. The `info()` method is deprecated — use `notice()` instead. Output is gated by `global.verbosity` and per-module overrides in `global.debug`. The `sanitize()` method strips keys matching `SYS_KEYS` (`mfs_`, `secret`, `session_id`, `password`, `db_name`, `finger`, `home_dir`, `sys_`, `_root`, `_host`, `_db`, `activation_`) and values that are paths inside `runtime_dir` or `data_dir`.

Separately, `lib/mariadb.js` suppresses SQL logging for queries matching `/password|passphrase|login|analytics_log/i`.

### Access Control: Permission, Privilege, Remit

Three distinct bit-flag systems govern access control:

**Permission** (`lib/lex/permission.js`) — a single capability bit:

| Name | Value |
|------|-------|
| owner | `0b0100000` |
| admin | `0b0010000` |
| delete / write / modify / upload | `0b0001000` |
| get / download | `0b0000100` |
| read / view | `0b0000010` |
| anonymous / anyone / guest | `0b0000001` |

**Privilege** (`lib/lex/privilege.js`) — a cumulative bit block (all permissions up to and including the role):

| Name | Value |
|------|-------|
| owner | `0b0111111` |
| admin | `0b0011111` |
| delete / write / modify / upload | `0b0001111` |
| get / download | `0b0000111` |
| read / view | `0b0000011` |
| anonymous | `0b0000001` |

**Remit** (`lib/lex/remit.js`) — domain-level role hierarchy (root → dom_owner → dom_admin → … → dom_member → read → write → delete → admin → owner).

Use `permissionValue()` / `privilegeValue()` from the public API to convert string names to numeric values.

### Email Transport: Two Messenger Classes

There are two co-existing email classes — this is intentional:

- **`lib/messenger.js`** — current version. `getMTA()` is async and supports Google OAuth2/Gmail (detects `googleapis.json` with a `token_uri` matching `googleapis.com`). Falls back to SMTP via `email.json`. The `dispatch()` method is a fire-and-forget wrapper around `send()`.
- **`lib/msg.js`** — legacy SMTP-only version. `getMTA()` is synchronous, reads only `email.json`. Kept for compatibility.

The public API exports `Messenger` from `messenger.js`.

### Email Templates

Templates live in `templates/email/`. The render pipeline in `Messenger.initialize()`:
1. Renders `templates/email/butler/{tpl}.tpl` → `page_content`
2. Wraps it in `templates/email/index.tpl` using lodash `template()`
3. Sanitizes via `sanitize-html`

Block partials are in `templates/email/block/`. The `_render()` method resolves paths relative to `lib/` using `Attr.base_dir` (defaults to `../templates/email`).

### Cache System

`DrumeeCache` (`lib/cache.js`) is a process-level singleton. `DrumeeCache.load(db)` must be called at startup to populate:
- `Filecap` — file extension capabilities from the `filecap` table
- `Sysconf` — system config from the `get_sys_conf` stored procedure
- `Lexicon` — i18n strings from `lib/dataset/locale/{lang}.json`

Language support defaults to `["en", "fr", "kh", "ru", "zh"]`, overridable via `/etc/drumee/conf.d/drumee.json`. Missing locale files fall back to English. `DrumeeCache.lex(lang)` returns a safe-proxy object that returns the key itself for missing entries.

### Database Access

`lib/mariadb.js` (`mariadb_stub`) extends `Logger` and wraps the MariaDB driver with a transaction-per-query model. Key methods:
- `call_proc(...args)` — calls a stored procedure
- `call_func(...args)` — calls a stored function (returns first column value)
- `query(sql, ...args)` — raw SQL query
- `await_proc/func/query` — async variants of the above
- `await_run(sql, args)` — direct parameterized query

On fatal connection errors (`ER_CMD_CONNECTION_CLOSED`, `ER_CONNECTION_TIMEOUT`), the process exits.

### Redis Message Bus

`RedisStore` (`lib/redis-store.js`) is a process-level singleton pub/sub bus. Config is read from `redis-config.json` or `redis.json` under `credential_dir`. Key static methods:
- `RedisStore.sendData(payload, dest)` — publishes to `liveUpdateChannel`; `dest` may be a socket ID string, object, or array
- `RedisStore.getSubscribe()` — creates a duplicate subscriber connection

### Other Modules

- **`lib/network.js`** — `request(opt, payload)`: HTTPS utility for internal Drumee service calls (supports GET/POST, streaming to file, MD5 hash of response)
- **`lib/offline.js`** — extends `Logger` with `exec(cmd)` (shelljs) and `stop(msg)` for CLI/offline scripts that need a clean exit
- **`lib/subtleCrypto.js`** — RSA/ECDH key operations using Node's `crypto.subtle`
- **`lib/template.js`** — lodash-template renderer with `include()` support for email partials
- **`lib/utils/mfa.js`** — TOTP/MFA and SMS dispatch (`sendSms`)

### Lex Constants

`lib/lex/constants.js` is a large (~20k line) enumeration. Do not add ad-hoc string literals to application code — look up or add constants here. Same applies to `lib/lex/attribute.js` for object attribute names.

### Backbone Addons

`lib/addons/` monkey-patches prototype methods onto `String`, `Array`, and `Number`. These are auto-loaded via `lib/addons/index.js` when the package is required and affect all instances globally.

### Environment Paths

`sysEnv()` returns the active config object built from `lib/default/env.json` merged with `/etc/drumee/drumee.json`. Key fields: `data_dir`, `runtime_dir`, `cache_dir`, `credential_dir`, `static_dir`, `mfs_dir`, `domain`, `endpoint_name`. `loadSysEnv(chroot)` re-initializes all paths under a chroot prefix (used in tests/scripts).

## Important Notes

- The codebase assumes a Drumee deployment environment with configuration under `/etc/drumee/`. When testing locally, ensure credential directories exist.
- `global.verbosity` controls log output level (0 = errors only, ≥3 = SQL logging in mariadb).
- `isPersistent = 1` on a Logger instance prevents `stop()` from tearing it down — used for long-lived DB/Redis connections.
