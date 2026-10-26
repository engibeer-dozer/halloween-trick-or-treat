"use strict";

// EDIT YOUR DESTINATIONS HERE. These example.com URLs are placeholders.
// Use full https:// URLs, or relative paths such as "./treat.html".
const CONFIG = {
  tricks: [
    "https://www.google.com/url?sa=i&source=web&rct=j&url=https://www.youtube.com/watch?v%3DdQw4w9WgXcQ%26t%3D29s&ved=2ahUKEwjO-PO_49iXAxUVnWoFHU_7DhcQy_kOegYIAAgLEAE&opi=89978449&cd&psig=AOvVaw007JyiUZo6rz1oFvY8YWja&ust=1793141696234000",
    // Add more URLs here, separated by commas, for a random trick.
    // Ideas: a Rickroll link, a family-friendly funny video,
    // a silly (not genuinely frightening) jump scare, or another webpage.
  ],
  // Ideas: an unlisted family video, cute animals, or another HTML page.
  treat: "https://photos.google.com/share/AF1QipNSU13tqx186QL1XWVk4Rf_Yfcj8JBYugR9e5V4mzL5zBdbRdv2W0WskFLJGB-amw/photo/AF1QipN9hx-q8UNeIUjXgHZLUU7x-4XfRjwGu_X6wehq?key=OGVrdm1SRzlFLTNIaF9fbWpZQXI5T2ZDU1E0OWlR",
  countdownSeconds: 3,
  revealDelayMs: 1000,
};

const screens = Array.from(document.querySelectorAll(".screen"));
const errorMessage = document.getElementById("error");
const count = document.getElementById("count");
const caption = document.getElementById("count-caption");
const wisdom = document.getElementById("wisdom");
let timer;
let wisdomTimer;
let activeScreen = "landing";

function showScreen(id) {
  // Cancel pending redirects whenever someone escapes or chooses another route.
  clearTimeout(timer);
  clearTimeout(wisdomTimer);
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
      wisdom.textContent = "The pumpkin says trick. The ghost says snacks.";
    }
  }, 6500);
}

function reportError(error) {
  console.error("Halloween destination error:", error);
  errorMessage.textContent = `Couldn't open your surprise. ${error.message}`;
  errorMessage.hidden = false;
}

function destinationUrl(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Add a destination URL in CONFIG near the top of script.js.");
  }
  const url = new URL(value, document.baseURI);
  // Reject executable URLs, but allow local HTML files when previewing via file://.
  if (!["https:", "http:"].includes(url.protocol) &&
      !(url.protocol === "file:" && location.protocol === "file:")) {
    throw new Error("Use an https:// URL or a relative HTML page path in CONFIG.");
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

function openDestination(url) {
  const destinationLink = document.getElementById("destination-link");
  destinationLink.href = url;
  destinationLink.hidden = true;
  showScreen("leaving");
  try {
    location.assign(url);
  } catch (error) {
    // Only offer another click when the browser explicitly blocks navigation.
    destinationLink.hidden = false;
    reportError(error);
  }
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
      timer = setTimeout(() => openDestination(url), CONFIG.revealDelayMs);
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
      case "reveal":
        try {
          openDestination(destinationUrl(CONFIG.treat));
        } catch (error) {
          reportError(error);
        }
        break;
    }
  });
});

// Show the demo note only while an example.com placeholder is still configured.
document.getElementById("demo-note").hidden = ![
  ...(Array.isArray(CONFIG.tricks) ? CONFIG.tricks : []), CONFIG.treat,
].some((value) => typeof value === "string" && /^https?:\/\/example\.com(?:[/?#]|$)/i.test(value));

// Don't steal focus on initial load. Focus follows deliberate screen changes.
startWhisper();
