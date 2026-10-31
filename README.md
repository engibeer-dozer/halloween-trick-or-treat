# Trick or Treat?

A mobile-first, static Halloween game for a costume QR code. HTML, CSS, and
vanilla JavaScript only: no backend, build step, frameworks, tracking, cookies,
or external player. The site is hosted on GitHub Pages but is hosting-independent.

## How it works

- Trick: confirm, watch 3... 2... 1..., see "YOU ASKED FOR IT!" for one second,
  then watch the selected local MP4 inside the page.
- "NOPE! GIVE ME A TREAT" switches directly to Treat.
- Treat: press "SHOW ME MY TREAT" to open its in-page video.
- Playback is attempted with sound after the choice, never on landing.
  Phones may block playback after the countdown; a "TAP TO PLAY" button appears
  when permission is required. Native controls remain available.
- Replay restarts the same clip. Choose again stops playback and unloads it.
- The escape button cancels the countdown and pending playback.
- Neither video is requested until selected. Only one player is used.
- Keyboard navigation, focus management, reduced motion, and large touch targets
  are supported. Short screens and enlarged text can scroll rather than clip.

## Preview locally

Open a terminal in this folder:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

On Windows, use `py` instead of `python3` if needed.
Visit **http://127.0.0.1:8000/**. Stop with **Ctrl+C**.
Python is a preview tool, not a website dependency. VS Code Live Server also works.
Opening `index.html` directly is supported, but an HTTP server is preferred.

For a phone on trusted Wi-Fi, bind to `0.0.0.0` and visit
`http://YOUR-COMPUTER-LAN-IP:8000/`. This exposes the folder to the network.
Use private-network firewall access only and stop the server afterward.
With WSL, running the Windows server command may simplify phone access.

## Change videos

Edit CONFIG at the top of `script.js`:

```js
const CONFIG = {
  tricks: [
    "./media/trick-30s.mp4",
  ],
  treat: "./media/halloween_skeleton_web_ready.mp4",
  countdownSeconds: 3,
  revealDelayMs: 1000,
};
```

Add more authorized MP4 paths to `tricks`, separated by commas, to select randomly
with equal probability on each confirmation. Repeats are possible. A single
entry is always chosen when it is the only one. Replay keeps the same selection.
All entries must be valid.

Use `./media/...` rather than `/media/...`: relative paths work under the
GitHub Pages repository subdirectory as well as other static hosts.
Full HTTPS URLs to actual browser-playable video files also work; YouTube and
Google Photos sharing pages are not direct MP4 sources.
Missing or unsupported videos display an error; Replay retries playback.
Countdown seconds must be a positive integer and reveal delay nonnegative.

## Media and privacy

- `media/trick-30s.mp4`: 30-second web copy, approximately 6.6 MB, H.264/AAC,
  720p, with fast-start metadata.
- `media/halloween_skeleton_web_ready.mp4`: Treat clip.
- The original full-length music-video file has been removed; only the short
  Trick clip is used.

Only publish media you own or have permission to edit and redistribute.
Files in a public website are publicly accessible, even without a link in its
interface. Deleting a file later does not remove it from Git history.
Do not add sensitive family media. Native playback has no platform-inserted ads.
For future clips, prefer H.264/AAC MP4 with fast start, and add captions for
meaningful speech. A large file or slow cellular connection can still buffer.

## Files and deployment

- `index.html`: screens, copy, and accessible native player.
- `style.css`: appearance, responsive video layout, and reduced-motion support.
- `script.js`: configuration, random choice, countdown, and playback lifecycle.
- `media/`: public video assets.

Publish these files and the selected media together. GitHub Pages, Cloudflare
Pages, Netlify, and other static hosts require no build command. Google Sites
can embed the hosted HTTPS site; iframe permissions can affect sound, playback,
and fullscreen. A direct QR link is simpler.

After local checks, commit and push to the configured GitHub Pages branch.
Check the deployed project URL, including both video paths, on iPhone and Android.
Playback policies vary, so desktop browser tests do not replace real-phone tests.
There is no visit counter yet; shared private statistics need a separate service.
