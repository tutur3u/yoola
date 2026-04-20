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
```

What they do:

- `TUTURUUU_API_BASE_URL`: Tuturuuu API base URL Yoola should call for EPM delivery.
- `TUTURUUU_YOOLA_WORKSPACE_ID`: the workspace bound in Tuturuuu EPM to the canonical external project that uses the `yoola` adapter.

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
