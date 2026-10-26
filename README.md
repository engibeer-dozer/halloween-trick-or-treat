# Trick or Treat?

A tiny, mobile-first Halloween game for a costume QR code. No personal information,
media, tracking, cookies, external fonts, libraries, audio, backend, or build step.
Nothing has been deployed.

## How it works

- **Trick:** choose Trick, confirm, watch 3... 2... 1..., then see
  "YOU ASKED FOR IT!" for one second before the configured destination opens
  automatically. No additional click is required after the countdown.
- **Back out:** "NOPE! GIVE ME A TREAT" goes directly to the Treat screen.
- **Treat:** choose Treat, then press "SHOW ME MY TREAT" to open its destination.
- The countdown's escape button cancels the countdown and pending navigation.
- A fallback destination link appears only if automatic navigation throws a
  browser error; it is hidden during normal navigation.
- A drifting ghost, tiny pumpkin-button wiggle, candy glow, and a delayed hint
  add mild mischief. Animations respect the device's reduced-motion preference.

## Preview locally

Open `index.html` directly in a browser for a quick preview. For a proper static
server, open a terminal in this folder and run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

On Windows, if `python3` isn't available, use:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Visit **http://127.0.0.1:8000/**. Stop the server with **Ctrl+C**.
Python is only a convenient local server, not a site dependency. An existing
static-server tool such as VS Code Live Server works too; no Node/npm is needed.

For a real phone on the same trusted Wi-Fi network, run
`python3 -m http.server 8000 --bind 0.0.0.0` (or use `py` on Windows), and open
`http://YOUR-COMPUTER-LAN-IP:8000/` on the phone. This exposes the current folder
to your network: use only a trusted network, allow only private-network firewall
access if prompted, and stop the server afterward. WSL networking may require
extra setup; running the Windows command in this folder is usually simpler.

## Change destinations

Edit **CONFIG at the top of `script.js`**:

```js
const CONFIG = {
  tricks: [
    "https://example.com/?surprise=trick",
  ],
  treat: "https://example.com/?surprise=treat",
  countdownSeconds: 3,
  revealDelayMs: 1000,
};
```

**Both example.com URLs are deliberate placeholders**, not actual videos or
treats. Replace them before sharing the final QR code. The demo note disappears
automatically when no example.com placeholders remain.

- Change the first URL inside `tricks` for the Trick destination.
- Change the URL after `treat:` for the Treat destination.
- Use quoted full `https://` URLs, or a relative path such as `"./treat.html"`
  if you later add another HTML page.
- An invalid or missing configuration produces an on-screen error rather than
  silently failing. Countdown seconds must be a positive integer; the reveal
  delay is a nonnegative number of milliseconds.

To add random tricks, add quoted URLs separated by commas:

```js
tricks: [
  "https://example.com/?surprise=trick-one",
  "https://example.com/?surprise=trick-two",
  "https://example.com/?surprise=trick-three",
],
```

One URL is always used if there is only one. Multiple URLs are chosen randomly
with equal probability each time the Trick is confirmed; repeats are possible.
Keep all entries valid. Ideas include a Rickroll **link**, a family-friendly
funny video, a silly surprise, or another webpage. No copyrighted video content
is included here. Treat could be an unlisted family video or a cute animal video.
Keep personal media outside this folder. An unlisted URL is not private or
password-protected, and configured URLs are visible to anyone viewing the source.
External destinations may have their own tracking, sign-in, or age restrictions.

## Files

- `index.html`: semantic screens, text, buttons, and decorative elements.
- `style.css`: responsive layout, orange/purple theme, animations, focus styles,
  and reduced-motion support.
- `script.js`: destinations, random selection, transitions, countdown, and hint.
- `README.md`: setup and customization instructions.

The layout prioritizes portrait phones, uses large touch targets, and allows
vertical scrolling on unusually short screens or with enlarged text rather than
clipping content. No automatic sound plays. Keyboard users can activate buttons
with Enter/Space; headings receive focus after screen changes.

## Hosting later (not deployed)

This project is intentionally **static and hosting-platform independent**.
Upload the three site files together, preserving their names and relative paths.
There is no domain assumption, root-relative asset path, router, or build command.

Possible options include GitHub Pages, Cloudflare Pages, Netlify, or any host
that serves HTML/CSS/JavaScript. Follow the chosen host's static-upload instructions;
no framework preset or build process is required.

For Google Sites, host these files on a static host first, then embed that site's
HTTPS URL using Sites' embed feature. Google Sites doesn't execute a folder of
uploaded HTML/CSS/JS as a standalone site. A sandboxed iframe or destination's
embedding policy can restrict redirects; the fallback link opens a new tab if
the embed allows it. Test the final embed on actual phones. Prefer linking the
costume QR directly to the static site for the simplest experience.

Before printing the QR code, replace the placeholders, choose a stable public
HTTPS address, test both flows on iPhone/Android, and check the QR at its actual
printed size. No QR code is generated yet because the final address is undecided.
