<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Video playback
## Maya
- Keep Maya lazy-loaded in the shared root, with in-memory temporary conversations and server-only AI/voice calls, so navigation and the existing intro stay independent.
- Never store chat transcripts; persist only service access-denial state server-side so terminal provider blocks survive restarts.
- Contact previews never send automatically; the dedicated endpoint must report unavailable until real managed email sending is configured, with verified WhatsApp drafts as an explicit alternative.

## Video playback
- Play every featured clip inside the app with the native video player: clips come only from uploaded assets, never from YouTube links.
- Never offer a download option for videos: the player hides the download control, blocks picture-in-picture and ignores the right-click save menu.

## Verifying clips
- Prebuffer only the selected film and release its media source when the player closes; pass request cancellation to Drive so abandoned streams do not compete with the next film.
- The sandbox browser cannot decode H.264, so any MP4 (uploaded or from an external CDN) reports "no supported sources" there while WebM plays; verify clip tiles, thumbnails and player controls in the preview and treat codec playback as unverified rather than broken.

## Page navigation
- Keep the cinematic intro and real-page tour in the shared root wrapper with static generated narration assets, session-only completion storage, and an audio-clock-driven greeting sequence; this preserves route content and avoids per-visitor voice-generation costs.
- Use the shared BackButton on content pages (not Home); it always returns to Home at the top, because every page is one step from Home.

## Audience figures
- Read social counts live server-side in src/routes/api/public/audience.ts behind a shared 5-minute cache, and poll from the client on the same interval; the saved figures in src/lib/social-stats.ts are fallback only. This keeps every visitor on one upstream read and never shows invented numbers.
- Outbound reads must send accept-language: en-US,en;q=0.9, because YouTube only shows the subscriber count with it; a source that throttles or fails is retried once and the newest real figure is kept rather than an older or invented one.

## Drive gallery
- Gallery videos come from the configured Google Drive folder via src/lib/drive.server.ts (shared 5-minute cache) and stream only through /api/public/video/$id, which checks the file is in that folder; Drive links are never sent to the browser.
- Replace gallery snapshots on refresh, exclude files without previews or stream access, and schedule client refresh from the server snapshot time so deletions do not linger for an extra cache interval. Only confirmed 404/410 responses evict files on playback errors; codec failures must never remove valid videos.
