# Backend operation and validation

Install with `npm ci`, then run `npm run dev` (or `npm start`). The variables required by `src/config/env.js` must be configured locally; do not commit credentials.

## Admin initialization

Set `ADMIN_SETUP_TOKEN` to a random secret of at least 32 characters. Send it in the `X-Admin-Setup-Token` header when calling `POST /api/auth/create-admin`. Without the configured secret, setup is disabled. Remove the variable after creating the account. This secret belongs only on the server and in the initialization client, never in Vite environment variables.

Only one admin is allowed. Startup waits for the unique `Admin.role` index. If a legacy database contains multiple admins, resolve those accounts manually before starting this version; startup will fail instead of silently choosing an account. Existing valid single-admin databases need no data rewrite.

## Browser security and private content

Set `FRONTEND_URL` to the frontend origin, for example `http://localhost:5173`. Unsafe requests with another Origin, or cross-site browser requests without an Origin, are rejected. CLI clients without browser headers may still authenticate with a cookie; CORS is not authorization. Admin authorization checks the current database record so disabling/deleting an account invalidates its access immediately.

Public project/blog/certificate/skill lists return only published/visible/active content regardless of query parameters. Administrative lists require the login cookie at:

- `GET /api/projects/admin`
- `GET /api/blogs/admin`
- `GET /api/certificates/admin`
- `GET /api/skills/admin`

Project ID reads require authentication. Blogs retain `/api/blogs/admin/:blogid`; private certificate and skill ID reads use `/admin/:id`. Public slug/ID routes do not return drafts or hidden content. The frontend API callers have been updated.

## Resume data integrity

Resume creation and metadata updates **require a MongoDB replica set or sharded cluster with transaction support**, such as MongoDB Atlas. Standalone MongoDB is insufficient. The `ResumeWriteLock` collection serializes activation changes, including concurrent first uploads. Failed writes roll back changes to the previously active resume. Cloudinary calls stay outside database transactions; failed database creation triggers cleanup of the new upload.

Contact statuses are `new`, `in-progress`, `resolved`, and `archived`. Read/unread is a separate boolean (`isRead`). Metadata PATCH requests preserve omitted fields; asset storage identifiers are assigned only by upload handlers.

## Checks

- `npm run lint`
- `npm test`

Tests start a disposable MongoDB 7.0.14 replica set and use synthetic data. The first run downloads a MongoDB binary. Cloudinary and SMTP are mocked; these tests do not verify live provider credentials or delivery. On this Amazon Linux sandbox, use `MONGOMS_DISTRO=ubuntu-22.04 npm test` to select the compatible Linux binary. No production database URI is used by the tests.
