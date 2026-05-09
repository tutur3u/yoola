# Yoola

Yoola is a Next.js front-end that consumes Tuturuuu EPM delivery.

## Configuration

Create `.env.local` from `.env.example` and set:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
TUTURUUU_API_BASE_URL=https://tuturuuu.com/api/v1
TUTURUUU_YOOLA_WORKSPACE_ID=your-workspace-id
TUTURUUU_WEB_APP_URL=https://tuturuuu.com
TUTURUUU_CMS_APP_URL=https://cms.tuturuuu.com
YOOLA_APP_URL=https://yoola.example.com
YOOLA_APP_ID=yoola
YOOLA_APP_SECRET=issued-from-tuturuuu-infrastructure
YOOLA_SESSION_SECRET=random-cookie-encryption-secret
```

What they do:

- `TUTURUUU_API_BASE_URL`: Tuturuuu API base URL Yoola should call for EPM delivery.
- `TUTURUUU_YOOLA_WORKSPACE_ID`: the workspace bound in Tuturuuu EPM to the canonical external project that uses the `yoola` adapter.
- `TUTURUUU_WEB_APP_URL`: optional centralized platform login origin. Defaults to `https://tuturuuu.com`, or `http://localhost:7803` when `DEV_MODE=true`.
- `TUTURUUU_CMS_APP_URL`: optional CMS app origin. Defaults to `https://cms.tuturuuu.com`, or `http://localhost:7811` when `DEV_MODE=true`.
- `YOOLA_APP_URL`: optional public Yoola origin used when building cross-app return URLs outside request context. Requests use their own origin by default.
- `YOOLA_APP_ID`: external app ID registered in Tuturuuu Infrastructure. Defaults to `yoola`.
- `YOOLA_APP_SECRET`: app secret issued from Tuturuuu Infrastructure -> External Apps. Yoola uses this to exchange central-login tokens for short-lived Tuturuuu API bearer tokens.
- `YOOLA_SESSION_SECRET`: local encrypted-cookie secret. If omitted, Yoola uses `YOOLA_APP_SECRET`.

Yoola now fails at startup when:

- `TUTURUUU_YOOLA_WORKSPACE_ID` is missing
- the configured workspace is not bound to an external project using the `yoola` adapter
- the EPM delivery request fails

## Development

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Integration Notes

- Gallery content is sourced from EPM `loadingData.artworks`.
- Writing index content is sourced from EPM `loadingData.loreCapsules`.
- Writing detail pages render markdown blocks from the entry body in the delivery payload.
- Navigation labels can be managed from EPM with `collection.config.navigation.title`.
- `/admin` is protected by the `apps/web` centralized login flow. Yoola is an external app: it exchanges the returned cross-app token through Tuturuuu with `YOOLA_APP_ID` and `YOOLA_APP_SECRET`, then stores only an encrypted local session cookie.
- Register the deployed Yoola origin in Tuturuuu Infrastructure -> External Apps with app ID `yoola`; Yoola does not require Tuturuuu production Supabase keys.
- The embedded admin workspace can edit entry title, slug, subtitle, summary, status, schedule, profile data, metadata, and collection navigation config. Full CMS links remain available for advanced operations such as uploads and workspace settings.
