
/* ========================================
   EDIT WEDDING DETAILS HERE
======================================== */

const WEDDING = {
  bride: "Shafaque",
  groom: "Shariq",
  weddingDate: "2026-11-22",

  events: [
    {
      name: "Haldi & Mehandi",
      date: "2026-11-21",
      time: "4:00 PM onwards",
      description: "A gathering of colour, music and joy.",
      symbol: "✧"
    },
    {
      name: "Nikah",
      date: "2026-11-22",
      time: "9:00 PM onwards",
      description: "The beginning of our forever.",
      symbol: "❋"
    },
    {
      name: "Rukhsati",
      date: "2026-11-23",
      time: "8:00 AM onwards",
      description: "An evening of love and celebration.",
      symbol: "✦"
    }
  ],

  venue: {
    name: "Grand Palace",
    location: "Hazaribagh · Jharkhand · India"
  }
};

/* ========================================
   HELPERS AND WEDDING DETAILS
======================================== */

const $ = id => document.getElementById(id);

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

$("brideName").textContent = WEDDING.bride;
$("groomName").textContent = WEDDING.groom;

$("miniNames").textContent =
  WEDDING.bride[0] + " & " + WEDDING.groom[0];

$("closingNames").textContent =
  WEDDING.groom + " & " + WEDDING.bride;

$("monogram").textContent =
  WEDDING.groom[0] + " & " + WEDDING.bride[0];

$("envelopeSeal").textContent = WEDDING.groom[0];
$("venueName").textContent = WEDDING.venue.name;
$("venueLocation").textContent = WEDDING.venue.location;

/* Format dates without timezone shifting */

function dateParts(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return {
    day: String(day).padStart(2, "0"),
    month: new Intl.DateTimeFormat("en", {
      month: "long",
      timeZone: "UTC"
    }).format(date),
    year: String(year)
  };
}

const mainDate = dateParts(WEDDING.weddingDate);

$("scratchDateDay").textContent = mainDate.day;

$("scratchDateMonth").textContent =
  `${mainDate.month} ${mainDate.year}`.toUpperCase();

/* ========================================
   REPEATING SCROLL REVEALS
======================================== */

let revealObserver = null;

function setupRevealObserver() {
  if (
    reducedMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    document.querySelectorAll(".reveal").forEach(element => {
      element.classList.add("visible");
    });

    return;
  }

  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        // Hide again so the animation repeats on re-entry.
        entry.target.classList.remove("visible");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -25px 0px"
  });

  document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
  });
}

setupRevealObserver();

/* ========================================
   DYNAMIC EVENT CARDS
======================================== */

WEDDING.events.forEach(event => {
  const date = dateParts(event.date);
  const card = document.createElement("article");

  card.className = "event reveal";

  card.innerHTML = `
    <div class="event-top">
      <span>Celebration</span>
      <span class="event-symbol">${event.symbol}</span>
    </div>

    <div class="event-date">
      <span class="event-day">${date.day}</span>

      <span class="event-date-side">
        <span class="event-month">${date.month}</span>
        <span class="event-year">${date.year}</span>
      </span>
    </div>

    <div class="event-line"></div>

    <h3>${event.name}</h3>
    <p class="event-time">${event.time}</p>
    <p class="event-description">${event.description}</p>
  `;

  $("events").appendChild(card);

  if (revealObserver) {
    revealObserver.observe(card);
  } else {
    card.classList.add("visible");
  }
});

/* ========================================
   ENVELOPE OPENING
======================================== */

let opened = false;

function openInvitation() {
  if (opened) return;

  opened = true;

  $("envelope").classList.add("open");
  $("openHint").textContent = "YOUR INVITATION AWAITS";

  setTimeout(() => {
    $("intro").classList.add("dismissed");
    document.body.classList.remove("locked");
  }, 1100);
}

$("envelope").addEventListener("click", openInvitation);

$("envelope").addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openInvitation();
  }
});

/* ========================================
   SCRATCH-TO-REVEAL DATE
======================================== */

const scratchCanvas = $("scratchCanvas");

const scratchCtx = scratchCanvas.getContext("2d", {
  willReadFrequently: true
});

const scratchCard = $("scratchCard");

let scratchW = 0;
let scratchH = 0;
let scratchDpr = 1;

let scratching = false;
let scratchRevealed = false;
let lastPoint = null;
let checkCounter = 0;

/* Draw the golden scratch surface */

function drawScratchCover() {
  scratchCtx.globalCompositeOperation = "source-over";
  scratchCtx.clearRect(0, 0, scratchW, scratchH);

  const gradient = scratchCtx.createLinearGradient(
    0, 0, scratchW, scratchH
  );

  [
    ["#8b672f", 0],
    ["#d9b76a", 0.2],
    ["#f1dc9c", 0.42],
    ["#a57c3a", 0.6],
    ["#e0c178", 0.82],
    ["#745022", 1]
  ].forEach(([color, position]) => {
    gradient.addColorStop(position, color);
  });

  scratchCtx.fillStyle = gradient;
  scratchCtx.fillRect(0, 0, scratchW, scratchH);

  const sheen = scratchCtx.createLinearGradient(
    0, 0, scratchW, 0
  );

  sheen.addColorStop(0, "#ffffff00");
  sheen.addColorStop(0.5, "#ffffff3d");
  sheen.addColorStop(1, "#ffffff00");

  scratchCtx.fillStyle = sheen;
  scratchCtx.fillRect(0, 0, scratchW, scratchH);

  // Subtle metallic texture.
  for (let i = 0; i < 450; i++) {
    scratchCtx.fillStyle =
      Math.random() > 0.5 ? "#ffffff12" : "#1e12050d";

    scratchCtx.fillRect(
      Math.random() * scratchW,
      Math.random() * scratchH,
      1,
      1
    );
  }

  scratchCtx.strokeStyle = "#422b0d88";
  scratchCtx.strokeRect(
    12, 12, scratchW - 24, scratchH - 24
  );

  scratchCtx.strokeStyle = "#fff4cd99";
  scratchCtx.strokeRect(
    15, 15, scratchW - 30, scratchH - 30
  );

  scratchCtx.textAlign = "center";
  scratchCtx.textBaseline = "middle";
  scratchCtx.fillStyle = "#4c3517";

  scratchCtx.font = "32px Georgia";
  scratchCtx.fillText(
    "✧", scratchW / 2, scratchH / 2 - 24
  );

  scratchCtx.font = "500 12px Montserrat, sans-serif";
  scratchCtx.fillText(
    "SCRATCH TO REVEAL",
    scratchW / 2,
    scratchH / 2 + 18
  );

  scratchCtx.font = "10px Montserrat, sans-serif";
  scratchCtx.fillText(
    "YOUR SPECIAL DATE",
    scratchW / 2,
    scratchH / 2 + 41
  );
}

/* Resize canvas for different screens */

function resizeScratch() {
  const rect = scratchCard.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  scratchW = rect.width;
  scratchH = rect.height;

  scratchDpr = Math.min(window.devicePixelRatio || 1, 2);

  scratchCanvas.width = Math.round(scratchW * scratchDpr);
  scratchCanvas.height = Math.round(scratchH * scratchDpr);

  scratchCanvas.style.width = scratchW + "px";
  scratchCanvas.style.height = scratchH + "px";

  scratchCtx.setTransform(
    scratchDpr, 0, 0, scratchDpr, 0, 0
  );

  drawScratchCover();
}

/* Convert pointer position to canvas coordinates */

function scratchPoint(event) {
  const rect = scratchCanvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

/* Erase the gold coating */

function scratchAt(point) {
  if (scratchRevealed) return;

  scratchCtx.save();
  scratchCtx.globalCompositeOperation = "destination-out";
  scratchCtx.lineWidth = 42;
  scratchCtx.lineCap = "round";
  scratchCtx.lineJoin = "round";
  scratchCtx.beginPath();

  if (lastPoint) {
    scratchCtx.moveTo(lastPoint.x, lastPoint.y);
    scratchCtx.lineTo(point.x, point.y);
    scratchCtx.stroke();
  } else {
    scratchCtx.arc(point.x, point.y, 21, 0, Math.PI * 2);
    scratchCtx.fill();
  }

  scratchCtx.restore();
  lastPoint = point;

  // Avoid reading every pixel on every pointer event.
  if (++checkCounter % 5 === 0) {
    checkScratchProgress();
  }
}

/* Calculate how much of the coating is erased */

function checkScratchProgress() {
  if (scratchRevealed || !scratchCanvas.width) return;

  const pixels = scratchCtx.getImageData(
    0, 0, scratchCanvas.width, scratchCanvas.height
  ).data;

  let clear = 0;
  let total = 0;

  for (let i = 3; i < pixels.length; i += 64) {
    total++;

    if (pixels[i] < 100) {
      clear++;
    }
  }

  const percent = total ? clear / total : 0;

  $("scratchProgressBar").style.width =
    Math.min(100, percent * 100) + "%";

  if (percent >= 0.42) {
    revealDate();
  }
}

/* Reveal the date and start the fireworks */

function revealDate() {
  if (scratchRevealed) return;

  scratchRevealed = true;
  scratching = false;
  lastPoint = null;

  scratchCanvas.classList.add("scratched-away");

  $("scratchHint").innerHTML =
    "<span>✦</span> YOUR SPECIAL DATE IS REVEALED";

  $("scratchProgressBar").style.width = "100%";
  $("celebrationMessage").classList.add("show");
  $("scratchRestart").style.display = "inline-block";

  launchScratchFireworks();
}

/* Pointer events support both mouse and touch */

scratchCanvas.addEventListener("pointerdown", event => {
  if (scratchRevealed) return;

  scratching = true;
  lastPoint = null;

  if (scratchCanvas.setPointerCapture) {
    scratchCanvas.setPointerCapture(event.pointerId);
  }

  scratchAt(scratchPoint(event));
  event.preventDefault();
});

scratchCanvas.addEventListener("pointermove", event => {
  if (!scratching || scratchRevealed) return;

  scratchAt(scratchPoint(event));
  event.preventDefault();
});

function endScratch() {
  if (!scratching) return;

  scratching = false;
  lastPoint = null;
  checkScratchProgress();
}

scratchCanvas.addEventListener("pointerup", endScratch);
scratchCanvas.addEventListener("pointercancel", endScratch);
scratchCanvas.addEventListener("lostpointercapture", endScratch);

/* Reset the scratch card */

$("scratchRestart").addEventListener("click", () => {
  scratchRevealed = false;
  scratching = false;
  lastPoint = null;
  checkCounter = 0;

  scratchCanvas.classList.remove("scratched-away");

  $("scratchHint").innerHTML =
    "<span>✧</span> SCRATCH HERE WITH YOUR FINGER OR MOUSE";

  $("scratchProgressBar").style.width = "0%";
  $("celebrationMessage").classList.remove("show");
  $("scratchRestart").style.display = "none";

  resizeScratch();
});

/* ========================================
   SCRATCH CARD FIREWORKS
======================================== */

const celebrationCanvas = $("celebrationCanvas");
const celebrationCtx = celebrationCanvas.getContext("2d");

let celebrationW = 0;
let celebrationH = 0;
let celebrationDpr = 1;

let scratchSparks = [];
let scratchFrame = null;

const goldColors = [
  "#f3dfac", "#d7b66c", "#fff3ce",
  "#e8c979", "#c89c46", "#ffffff"
];

function resizeCelebration() {
  const rect = $("scratchSection").getBoundingClientRect();

  celebrationW = rect.width;
  celebrationH = rect.height;

  celebrationDpr = Math.min(window.devicePixelRatio || 1, 2);

  celebrationCanvas.width = Math.round(
    celebrationW * celebrationDpr
  );

  celebrationCanvas.height = Math.round(
    celebrationH * celebrationDpr
  );

  celebrationCanvas.style.width = celebrationW + "px";
  celebrationCanvas.style.height = celebrationH + "px";

  celebrationCtx.setTransform(
    celebrationDpr, 0, 0, celebrationDpr, 0, 0
  );
}

function burstScratch(x, y) {
  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;

    scratchSparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60 + Math.random() * 25,
      size: 1 + Math.random() * 2,
      color: goldColors[
        Math.floor(Math.random() * goldColors.length)
      ]
    });
  }
}

function launchScratchFireworks() {
  if (reducedMotion.matches) return;

  resizeCelebration();

  burstScratch(celebrationW * 0.5, celebrationH * 0.43);
  burstScratch(celebrationW * 0.23, celebrationH * 0.35);
  burstScratch(celebrationW * 0.77, celebrationH * 0.35);

  setTimeout(() => {
    if (scratchRevealed) {
      burstScratch(celebrationW * 0.5, celebrationH * 0.28);
    }
  }, 450);

  if (scratchFrame === null) {
    animateScratch();
  }
}

function animateScratch() {
  celebrationCtx.clearRect(
    0, 0, celebrationW, celebrationH
  );

  scratchSparks = scratchSparks.filter(
    particle => particle.life > 0
  );

  scratchSparks.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.985;
    particle.vy = particle.vy * 0.985 + 0.035;
    particle.life--;

    celebrationCtx.globalAlpha = Math.min(
      1, particle.life / 25
    );

    celebrationCtx.fillStyle = particle.color;
    celebrationCtx.beginPath();

    celebrationCtx.arc(
      particle.x,
      particle.y,
      particle.size,
      0,
      Math.PI * 2
    );

    celebrationCtx.fill();
  });

  celebrationCtx.globalAlpha = 1;

  if (scratchSparks.length && !reducedMotion.matches) {
    scratchFrame = requestAnimationFrame(animateScratch);
  } else {
    scratchFrame = null;

    celebrationCtx.clearRect(
      0, 0, celebrationW, celebrationH
    );
  }
}

/* ========================================
   AMBIENT GOLD PARTICLES
======================================== */

const particleCanvas = $("particles");
const particleCtx = particleCanvas.getContext("2d");

let particleW = 0;
let particleH = 0;
let particles = [];
let particleFrame = null;

function resizeParticles() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  particleW = window.innerWidth;
  particleH = window.innerHeight;

  particleCanvas.width = particleW * dpr;
  particleCanvas.height = particleH * dpr;

  particleCanvas.style.width = particleW + "px";
  particleCanvas.style.height = particleH + "px";

  particleCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = reducedMotion.matches
    ? 0
    : Math.min(65, Math.floor(particleW / 18));

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * particleW,
    y: Math.random() * particleH,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.35 + 0.08,
    drift: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.15
  }));
}

function drawParticles() {
  particleCtx.clearRect(0, 0, particleW, particleH);

  particles.forEach(particle => {
    particle.y -= particle.speed;
    particle.x += particle.drift;

    if (particle.y < -5) {
      particle.y = particleH + 5;
      particle.x = Math.random() * particleW;
    }

    if (particle.x < 0) particle.x = particleW;
    if (particle.x > particleW) particle.x = 0;

    particleCtx.beginPath();

    particleCtx.arc(
      particle.x,
      particle.y,
      particle.r,
      0,
      Math.PI * 2
    );

    particleCtx.fillStyle =
      `rgba(225,190,110,${particle.opacity})`;

    particleCtx.fill();
  });

  if (!reducedMotion.matches) {
    particleFrame = requestAnimationFrame(drawParticles);
  }
}

/* ========================================
   PALACE SKY: STARS AND FIREWORKS
======================================== */

const palaceCanvas = $("palaceFireworks");
const palaceCtx = palaceCanvas.getContext("2d");
const palaceScene = $("palaceScene");

let palaceW = 0;
let palaceH = 0;
let palaceDpr = 1;

let skyStars = [];
let skySparks = [];

let palaceFrame = null;
let palaceVisible = false;
let lastBurst = 0;

function resizePalace() {
  const rect = palaceScene.getBoundingClientRect();

  palaceW = rect.width;
  palaceH = rect.height;

  palaceDpr = Math.min(window.devicePixelRatio || 1, 2);

  palaceCanvas.width = Math.round(palaceW * palaceDpr);
  palaceCanvas.height = Math.round(palaceH * palaceDpr);

  palaceCanvas.style.width = palaceW + "px";
  palaceCanvas.style.height = palaceH + "px";

  palaceCtx.setTransform(
    palaceDpr, 0, 0, palaceDpr, 0, 0
  );

  skyStars = Array.from({
    length: Math.max(24, Math.floor(palaceW / 22))
  }, () => ({
    x: Math.random() * palaceW,
    y: Math.random() * palaceH * 0.30,
    r: 0.4 + Math.random() * 1.3,
    phase: Math.random() * 6.28,
    speed: 0.8 + Math.random() * 1.8
  }));
}

function burstPalace(x, y) {
  for (let i = 0; i < 55; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;

    skySparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.012 + Math.random() * 0.02,
      life: 48 + Math.random() * 32,
      max: 80,
      size: 0.7 + Math.random() * 1.5,
      color: goldColors[
        Math.floor(Math.random() * goldColors.length)
      ]
    });
  }
}

function animatePalace(time) {
  palaceCtx.clearRect(0, 0, palaceW, palaceH);

  // Twinkling stars.
  skyStars.forEach(star => {
    palaceCtx.globalAlpha =
      0.25 + 0.65 * (
        0.5 + 0.5 * Math.sin(
          time * 0.001 * star.speed + star.phase
        )
      );

    palaceCtx.fillStyle = "#f5d98e";
    palaceCtx.beginPath();

    palaceCtx.arc(
      star.x, star.y, star.r, 0, Math.PI * 2
    );

    palaceCtx.fill();
  });

  // Firework particles.
  skySparks = skySparks.filter(
    particle => particle.life > 0
  );

  skySparks.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.987;
    particle.vy = particle.vy * 0.987 + particle.gravity;
    particle.life--;

    palaceCtx.globalAlpha = Math.max(
      0, particle.life / particle.max
    );

    palaceCtx.fillStyle = particle.color;
    palaceCtx.shadowBlur = 7;
    palaceCtx.shadowColor = particle.color;

    palaceCtx.beginPath();

    palaceCtx.arc(
      particle.x,
      particle.y,
      particle.size,
      0,
      Math.PI * 2
    );

    palaceCtx.fill();
  });

  palaceCtx.globalAlpha = 1;
  palaceCtx.shadowBlur = 0;

  // Periodic fireworks in the upper sky.
  if (palaceVisible && time - lastBurst > 6500) {
    burstPalace(
      palaceW * (0.12 + Math.random() * 0.76),
      palaceH * (0.06 + Math.random() * 0.22)
    );

    lastBurst = time;
  }

  if (palaceVisible && !reducedMotion.matches) {
    palaceFrame = requestAnimationFrame(animatePalace);
  } else {
    palaceFrame = null;
  }
}

function startPalace() {
  if (
    !palaceVisible ||
    reducedMotion.matches ||
    palaceFrame !== null
  ) {
    return;
  }

  palaceFrame = requestAnimationFrame(animatePalace);
}

/* Run palace animation only while it is visible. */

if ("IntersectionObserver" in window) {
  const palaceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      palaceVisible = entry.isIntersecting;

      if (palaceVisible) {
        resizePalace();
        startPalace();
      } else if (palaceFrame !== null) {
        cancelAnimationFrame(palaceFrame);
        palaceFrame = null;
      }
    });
  }, { threshold: 0.03 });

  palaceObserver.observe(palaceScene);
} else {
  palaceVisible = true;
  resizePalace();
  startPalace();
}

/* ========================================
   INITIALIZATION AND RESIZE
======================================== */

function initialize() {
  if (particleFrame !== null) {
    cancelAnimationFrame(particleFrame);
  }

  particleFrame = null;

  resizeParticles();
  drawParticles();

  resizeScratch();
  resizeCelebration();
  resizePalace();

  if (palaceVisible) {
    startPalace();
  }
}

window.addEventListener("resize", initialize);

/* Respect changes to the system motion preference. */

reducedMotion.addEventListener("change", () => {
  if (particleFrame !== null) {
    cancelAnimationFrame(particleFrame);
  }

  if (palaceFrame !== null) {
    cancelAnimationFrame(palaceFrame);
  }

  if (scratchFrame !== null) {
    cancelAnimationFrame(scratchFrame);
  }

  particleFrame = null;
  palaceFrame = null;
  scratchFrame = null;

  resizeParticles();
  drawParticles();

  if (palaceVisible) {
    startPalace();
  }
});

/* Start everything. */

initialize();
