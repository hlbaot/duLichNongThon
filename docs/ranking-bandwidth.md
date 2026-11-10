# Ranking bandwidth

The ranking stream uses `/rankings/stream?compact=1`. Every connection begins
with a complete `rankings` snapshot. Later `ranking-counts` events carry absolute
counts and ranks for every destination; the store merges these with metadata.
Unknown/missing identities trigger a full refresh without clearing valid data.

Hidden tabs close EventSource, cancel timers and abort ranking fallback requests.
Returning tabs reopen the stream and immediately catch up. A healthy stream
stops fallback requests. Otherwise fallback waits 30–35 seconds, then 60–65
seconds between reads, using `/rankings/counts` after metadata is available.
HTTP responses cannot overwrite a newer stream snapshot.

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
