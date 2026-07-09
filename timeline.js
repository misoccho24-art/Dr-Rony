/* =========================================================
   Renders timelineData (from timeline-data.js) into alternating
   cards, then animates them in on scroll and fills the center
   line as the user scrolls through the section.
   ========================================================= */

const TYPE_ICONS = {
    birth: "✨",
    education: "🎓",
    career: "🩺",
    present: "📍"
};

function renderTimeline() {
    const container = document.getElementById("timelineItems");
    const sorted = [...timelineData].sort((a, b) => a.year - b.year);

    sorted.forEach((item, i) => {
        const el = document.createElement("div");
        el.className = `timeline-item ${i % 2 === 0 ? "left" : "right"}`;
        const icon = TYPE_ICONS[item.type] || "•";
        el.innerHTML = `
            <div class="timeline-dot">${icon}</div>
            <div class="timeline-card">
                <span class="timeline-year">${escapeHtml(String(item.year))}${item.estimated ? '<span class="timeline-estimated-flag">(আনুমানিক)</span>' : ""}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
                ${item.image ? `<img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.title)}" loading="lazy">` : ""}
            </div>
        `;
        container.appendChild(el);
    });
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
}

function setupReveal() {
    const items = document.querySelectorAll(".timeline-item");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25, rootMargin: "0px 0px -60px 0px" });

    items.forEach(item => observer.observe(item));
}

function setupLineFill() {
    const timeline = document.getElementById("timeline");
    const fill = document.getElementById("timelineLineFill");
    const traveler = document.getElementById("timelineTraveler");

    function update() {
        const rect = timeline.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const startPoint = viewportH * 0.8;
        const progress = (startPoint - rect.top) / rect.height;
        const clamped = Math.max(0, Math.min(1, progress));
        fill.style.height = `${clamped * 100}%`;
        if (traveler) {
            traveler.style.top = `${clamped * 100}%`;
            traveler.style.opacity = clamped > 0 && clamped < 1 ? "1" : "0";
        }
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
}

renderTimeline();
setupReveal();
setupLineFill();
