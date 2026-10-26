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
- Play every featured clip inside the app with the native video player: clips come only from uploaded assets, never from YouTube links, and the player sets controlsList="nodownload", disablePictureInPicture and blocks the right-click menu so visitors cannot save the files.

## Page navigation
- Use the shared BackButton on content pages (not Home); it always returns to Home at the top, because every page is one step from Home.

## Audience figures
- Read social counts live server-side in src/routes/api/public/audience.ts behind a shared 5-minute cache, and poll from the client on the same interval; the saved figures in src/lib/social-stats.ts are fallback only. This keeps every visitor on one upstream read and never shows invented numbers.
- Outbound reads must send accept-language: en-US,en;q=0.9, because YouTube only shows the subscriber count with it; a source that throttles or fails is retried once and the newest real figure is kept rather than an older or invented one.
