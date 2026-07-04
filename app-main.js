// ── Top 10 Today auto-scroll init ──
// Fetches top 10 trending movies, renders into #top10-track, and starts an auto-scrolling loop
async function initTop10Today() {
  try {
    await loadTop10Today();
  } catch (err) {
    console.warn('Top 10 load failed', err);
  }
}

let _top10Anim = null;
function startTop10AutoScroll() {
  const track = document.getElementById('top10-track');
  const viewport = track?.parentElement;
  if (!track || !viewport) return;

  // Cancel any existing animation
  if (_top10Anim) cancelAnimationFrame(_top10Anim);

  let pos = 0;
  const speed = 0.35; // px per frame, tweak for speed

  let last = performance.now();
  function step(now) {
    const dt = now - last;
    last = now;
    pos += speed * (dt / 16.67); // normalize to 60fps
    // loop when scrolled past first duplicate set
    const fullW = track.scrollWidth / 2;
    if (pos >= fullW) pos = 0;
    track.style.transform = `translateX(${-pos}px)`;
    _top10Anim = requestAnimationFrame(step);
  }

  _top10Anim = requestAnimationFrame(step);

  // Pause on hover
  viewport.addEventListener('mouseenter', pauseTop10AutoScroll);
  viewport.addEventListener('mouseleave', resumeTop10AutoScroll);
}

function pauseTop10AutoScroll() {
  if (_top10Anim) {
    cancelAnimationFrame(_top10Anim);
    _top10Anim = null;
  }
}

function resumeTop10AutoScroll() {
  if (!_top10Anim) startTop10AutoScroll();
}

// Start after DOM ready
window.addEventListener('load', () => {
  initTop10Today().then(() => startTop10AutoScroll()).catch(() => {});
});
