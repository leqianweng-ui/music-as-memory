# Music as Memory

An interactive music curation and visual storytelling project. A painted fruit basket opens six musical stories, with video, bilingual lyrics, playback-following lyric scrolls, and a fruit-market collection of playlists.

## Website

The finished static website lives in `dist/`. It uses HTML, CSS, and vanilla JavaScript, with relative asset paths and hash-based navigation. No framework, package installation, or build step is required.

For a local preview, install Node.js, run `node server.cjs`, then open the address printed by the server. Browsers may require a click before audible playback.

## Publishing

In repository Settings → Pages, select **GitHub Actions** as the source. The workflow publishes only `dist/` on pushes to `main`; the homepage is `dist/index.html`, not this README.

The original media is preserved without recompression. Cormorant Garamond and DM Sans load from Google Fonts. Broadway uses a locally installed font when available, with the existing Georgia fallback. Media and third-party fonts retain their respective owners' rights.