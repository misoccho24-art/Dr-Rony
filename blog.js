/* =========================================================
   Public blog page
   Reads blog-posts.txt (kept up to date via /admin.html)
   and renders post cards + a click-to-read modal.
   Relies on blog-shared.js for parsing/escaping helpers.
   ========================================================= */

async function loadPosts() {
    const grid = document.getElementById("blog-grid");

    let raw;
    try {
        const res = await fetch("blog-posts.txt", { cache: "no-store" });
        if (!res.ok) throw new Error("file not found");
        raw = await res.text();
    } catch (err) {
        grid.innerHTML = `<p class="blog-status">লেখা লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।</p>`;
        return;
    }

    const posts = parsePosts(raw);

    if (!posts.length) {
        grid.innerHTML = `<p class="blog-status">এখনো কোনো পোস্ট যোগ করা হয়নি। শীঘ্রই নতুন লেখা আসবে।</p>`;
        return;
    }

    grid.innerHTML = "";
    posts.forEach((post) => {
        const card = document.createElement("article");
        card.className = "blog-card";

        card.innerHTML = `
            ${post.image ? `<div class="blog-card-img"><img src="${escapeAttr(post.image)}" alt="${escapeAttr(post.title)}" loading="lazy"></div>` : ""}
            <div class="blog-card-body">
                ${post.date ? `<span class="blog-card-date">${escapeHtml(post.date)}</span>` : ""}
                <h3>${escapeHtml(post.title)}</h3>
                <p>${escapeHtml(excerpt(post.paragraphs[0] || ""))}</p>
                <span class="blog-card-read">পুরোটা পড়ুন →</span>
            </div>
        `;

        card.addEventListener("click", () => openPost(post));
        grid.appendChild(card);
    });
}

/* ---------- Modal (full post view) ---------- */

const postOverlay = document.getElementById("postOverlay");
const postModalImg = document.getElementById("postModalImg");
const postModalDate = document.getElementById("postModalDate");
const postModalTitle = document.getElementById("postModalTitle");
const postModalBody = document.getElementById("postModalBody");
const postClose = document.getElementById("postClose");

function openPost(post) {
    if (post.image) {
        postModalImg.src = post.image;
        postModalImg.alt = post.title;
        postModalImg.style.display = "block";
    } else {
        postModalImg.style.display = "none";
    }
    postModalDate.textContent = post.date;
    postModalDate.style.display = post.date ? "inline-block" : "none";
    postModalTitle.textContent = post.title;
    postModalBody.innerHTML = post.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("");

    postOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closePost() {
    postOverlay.classList.remove("show");
    document.body.style.overflow = "";
}

postClose.addEventListener("click", closePost);
postOverlay.addEventListener("click", (e) => {
    if (e.target === postOverlay) closePost();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePost();
});

loadPosts();
