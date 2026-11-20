# Ranking bandwidth

The ranking stream uses `/rankings/stream?compact=1`. Every connection begins
with a complete `rankings` snapshot. Later `ranking-counts` events carry absolute
counts and ranks for every destination; the store merges these with metadata.
Unknown/missing identities trigger a full refresh without clearing valid data.

Hidden tabs close EventSource, cancel timers and abort ranking fallback requests.
Returning tabs catch up immediately. When a stream fails, the browser closes it
and waits at least two minutes before reopening it. A healthy stream stops
fallback requests. The first fallback starts after 4–6 seconds, followed by a
30–35 second wait and then 60–65 seconds between reads. The fallback uses
`/api/rankings`, then `/api/rankings/counts` once metadata is available. Vercel
caches successful public responses for 15 seconds and can serve a stale copy
during upstream failures. A newer stream snapshot takes precedence over an
in-flight HTTP response.

Deploy the compatible backend first. The frontend accepts legacy full events
and falls back to `/rankings` on counts endpoint 404/405, allowing either side
to roll back independently. No database changes or data cleanup are required.

Validation:

```sh
node --test tests/*.test.mjs
pnpm exec tsc --noEmit
pnpm build
```

The build requires `NEXT_PUBLIC_API_BASE_URL` to point to the backend.
