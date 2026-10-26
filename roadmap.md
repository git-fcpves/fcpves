# Roadmap

- [x] Add a back arrow to every page and verify previous-page navigation and the Home fallback

- [x] Bottom dock with 5 categories (Home, About, Work, Projects, Connect)
- [x] Connect page with all social + contact options
- [x] Projects page: AI, GPT, GitHub, editing, automation projects
- [x] Dock navigation between pages (hash jump lands on the right section)
- [x] Work: nine categories with sample clips the app serves itself
- [x] Work is its own page (/work), removed from Home; dock Work opens it
- [x] Remove every long dash (—) from all wording on every page
- [x] Home sample work plays Sagar's 8 real uploaded clips (muhurtham, reception, wedding, pre wedding 1 and 2, teaser 4K, teaser 2, AI video), each served from its own src/assets pointer
- [x] Home: sample work clips row + GPT links (Photography GPT, FCPVES Colorist AI, Editor Sagar) + project teasers
- [x] Home sample work: 3x2 grid of clean 3:2 thumbnails, tap opens the shared in-app player without badges or YouTube redirects
- [x] Home sample work: 1st tile "Rooted in Love" opens its own video (youtu.be/er1WXxV_5KA) with its real YouTube thumbnail
- [x] Home sample work: 2nd tile "Modern Love" opens its own video (youtu.be/0ASm37QZjdc) with its real YouTube thumbnail
- [x] Home sample work: 3rd tile opens its own video (youtu.be/rJB3l8hkYB0), but that video is private so visitors can't play it
- [ ] Fix 3rd tile: video must be public/unlisted, or Sagar sends a different link, title and frame
- [x] Three YouTube films removed from sample work; the grid now holds only uploaded clips (13 tiles) and the player hides the download control

- [x] Placeholder tiles 4-6 removed: the grid now runs 11 tiles, each opening its own video (3 YouTube films + 8 uploaded clips)
- [x] Embed supplied YouTube films inside the app and retain native playback for remaining samples
- [x] Add the three supplied films to Cinematic videos in order, using the shared in-app player
- [x] Home: Audience section with bar and circle graphs for Instagram @ig.fcpves and YouTube @KANNADABHAKTHIGEETHEYGALU (figures live in src/lib/social-stats.ts)
- [x] Audience graphs refresh themselves every 5 minutes from the real accounts via /api/public/audience, with the saved figures as fallback
- [x] Instagram @ig.fcpves followers set to 10K per Sagar; update src/lib/social-stats.ts whenever the real count changes
- [x] About page rebuilt from uploaded professional profile: portrait + name hero, summary, 13-role experience timeline, skills, tools, education, 8 awards, Bili Haale project, sports, animated language bars, interests; staggered fade-up animations
- [x] Home sample work: Teaser and Wedding Teaser added as tiles 12 and 13 (13 tiles total); teaser_new_4k-3 and Wedding_Reel-2 were identical copies of clips already in the app, so they were not added again
- [ ] Move the real clips into the matching /work categories (Cinematic, Teasers, AI videos) once Sagar confirms the mapping; the other categories still use placeholder clips

