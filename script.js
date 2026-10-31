"use strict";

// EDIT YOUR VIDEO PATHS HERE. Keep "./media/" for GitHub Pages project sites.
// Add more authorized MP4 paths to tricks for a random selection.
const CONFIG = {
  tricks: [
    "./media/trick-30s.mp4",
  ],
  treat: "./media/halloween_skeleton_web_ready.mp4",
  countdownSeconds: 3,
  revealDelayMs: 1000,
};

const screens = Array.from(document.querySelectorAll(".screen"));
const errorMessage = document.getElementById("error");
const count = document.getElementById("count");
const caption = document.getElementById("count-caption");
const wisdom = document.getElementById("wisdom");
const video = document.getElementById("surprise-video");
const videoStatus = document.getElementById("video-status");
const playButton = document.getElementById("play-video");
let timer;
let wisdomTimer;
let activeScreen = "landing";
let playbackVersion = 0;

function stopVideo() {
  playbackVersion += 1;
  video.pause();
  video.removeAttribute("src");
  video.load();
  playButton.hidden = true;
}

function showScreen(id) {
  // Cancel pending redirects whenever someone escapes or chooses another route.
  clearTimeout(timer);
  clearTimeout(wisdomTimer);
  if (activeScreen === "player" && id !== "player") stopVideo();
  activeScreen = id;
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  for (const screen of screens) {
    screen.hidden = screen.id !== id;
  }
  document.querySelector(`#${id} h1, #${id} h2`).focus({ preventScroll: true });
  if (id === "landing") startWhisper();
}

function startWhisper() {
  wisdom.textContent = "Choose wisely...";
  wisdomTimer = setTimeout(() => {
    if (activeScreen === "landing") {
      wisdom.textContent = "The pumpkin says trick. The ghost says treat.";
    }
  }, 6500);
}

function reportError(error) {
  console.error("Halloween surprise error:", error);
  errorMessage.textContent = `Couldn't open your surprise. ${error.message}`;
  errorMessage.hidden = false;
}

function destinationUrl(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Add a video path in CONFIG near the top of script.js.");
  }
  const url = new URL(value, document.baseURI);
  // Reject executable URLs, but allow local media when previewing via file://.
  if (!["https:", "http:"].includes(url.protocol) &&
      !(url.protocol === "file:" && location.protocol === "file:")) {
    throw new Error("Use an https:// video URL or a relative MP4 path in CONFIG.");
  }
  return url.href;
}

function pickTrick() {
  if (!Array.isArray(CONFIG.tricks) || CONFIG.tricks.length === 0) {
    throw new Error("Add at least one URL to CONFIG.tricks in script.js.");
  }
  // Validate every entry so a broken random choice is reported consistently.
  const urls = CONFIG.tricks.map(destinationUrl);
  return urls[Math.floor(Math.random() * urls.length)];
}

async function playVideo() {
  const version = ++playbackVersion;
  playButton.hidden = true;
  errorMessage.hidden = true;
  videoStatus.textContent = "Loading your surprise...";
  try {
    await video.play();
  } catch (error) {
    // Ignore only a playback attempt superseded by navigation or another attempt.
    if (version !== playbackVersion) return;
    if (error.name === "NotAllowedError") {
      videoStatus.textContent = "Your browser needs a tap to start playback.";
      playButton.hidden = false;
    } else {
      videoStatus.textContent = "Playback couldn't start.";
      reportError(error);
    }
  }
}

function showVideo(url, kind) {
  stopVideo();
  document.getElementById("player-title").textContent =
    kind === "trick" ? "🎃 Your trick is here!" : "🍬 Enjoy your treat!";
  showScreen("player");
  videoStatus.textContent = "Loading your surprise...";
  video.src = url;
  playVideo();
}

function pulseCount() {
  count.classList.remove("pulse");
  // Flush this tiny element's style so the CSS animation restarts for each number.
  void count.offsetWidth;
  count.classList.add("pulse");
}

function startCountdown() {
  let url;
  try {
    url = pickTrick();
    if (!Number.isInteger(CONFIG.countdownSeconds) || CONFIG.countdownSeconds < 1 ||
        !Number.isFinite(CONFIG.revealDelayMs) || CONFIG.revealDelayMs < 0) {
      throw new Error("Use a positive whole countdownSeconds and a nonnegative revealDelayMs.");
    }
  } catch (error) {
    reportError(error);
    return;
  }

  count.classList.remove("reveal", "pulse");
  count.textContent = `${CONFIG.countdownSeconds}...`;
  caption.textContent = "Summoning extremely mild chaos.";
  showScreen("countdown");
  pulseCount();
  let remaining = CONFIG.countdownSeconds;

  function tick() {
    remaining -= 1;
    if (remaining > 0) {
      count.textContent = `${remaining}...`;
      pulseCount();
      timer = setTimeout(tick, 1000);
    } else {
      count.classList.remove("pulse");
      count.textContent = "YOU ASKED FOR IT!";
      count.classList.add("reveal");
      caption.textContent = "One perfectly ridiculous surprise, coming right up.";
      timer = setTimeout(() => showVideo(url, "trick"), CONFIG.revealDelayMs);
    }
  }
  timer = setTimeout(tick, 1000);
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    switch (button.dataset.action) {
      case "trick": showScreen("trick"); break;
      case "treat": showScreen("treat"); break;
      case "home": showScreen("landing"); break;
      case "confirm": startCountdown(); break;
      case "play": playVideo(); break;
      case "replay":
        if (video.error) video.load();
        video.currentTime = 0;
        playVideo();
        break;
      case "reveal":
        try {
          showVideo(destinationUrl(CONFIG.treat), "treat");
        } catch (error) {
          reportError(error);
        }
        break;
    }
  });
});

video.addEventListener("playing", () => {
  videoStatus.textContent = "Enjoy! Sound and fullscreen controls are in the player.";
  playButton.hidden = true;
  errorMessage.hidden = true;
});
video.addEventListener("waiting", () => {
  if (activeScreen === "player") videoStatus.textContent = "Buffering your surprise...";
});
video.addEventListener("ended", () => {
  videoStatus.textContent = "That's your surprise! Replay or choose again.";
});
video.addEventListener("error", () => {
  if (activeScreen !== "player" || !video.error) return;
  videoStatus.textContent = "The video couldn't load.";
  reportError(new Error("Check the MP4 path, connection, and browser-compatible encoding. Try Replay to retry."));
});

// Don't steal focus on initial load. Focus follows deliberate screen changes.
startWhisper();
