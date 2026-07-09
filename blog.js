/* =========================================================
   Blog admin panel — posts directly to GitHub via its REST API.
   No server, no database: the browser talks to api.github.com
   using an access token the client enters once and it is
   remembered on that device.

   ---- SETUP (do this once when you deploy the site) ----
   Fill in your GitHub username and repository name below.
   ========================================================= */

const GITHUB_OWNER  = "REPLACE_WITH_GITHUB_USERNAME";   // e.g. "drronyent"
const GITHUB_REPO   = "REPLACE_WITH_REPO_NAME";          // e.g. "website"
const GITHUB_BRANCH = "main";                            // change to "master" if that's your default branch

const POSTS_FILE  = "blog-posts.txt";
const IMAGES_DIR  = "blog-images";

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

/* ---------- Token storage ---------- */

function getToken() {
    return localStorage.getItem("blog_admin_token") || sessionStorage.getItem("blog_admin_token");
}
function setToken(token, remember) {
    if (remember) localStorage.setItem("blog_admin_token", token);
    else sessionStorage.setItem("blog_admin_token", token);
}
function clearToken() {
    localStorage.removeItem("blog_admin_token");
    sessionStorage.removeItem("blog_admin_token");
}

function ghHeaders(token) {
    return {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
    };
}

/* ---------- GitHub API helpers ---------- */

async function ghGetFile(path, token) {
    const res = await fetch(`${API_BASE}/contents/${path}?ref=${GITHUB_BRANCH}&_=${Date.now()}`, {
        headers: ghHeaders(token)
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub error (${res.status}) reading ${path}`);
    const data = await res.json();
    return { sha: data.sha, content: base64ToUtf8(data.content) };
}

async function ghPutFile(path, base64Content, message, sha, token) {
    const body = { message, content: base64Content, branch: GITHUB_BRANCH };
    if (sha) body.sha = sha;
    const res = await fetch(`${API_BASE}/contents/${path}`, {
        method: "PUT",
        headers: { ...ghHeaders(token), "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`GitHub error (${res.status}) saving ${path}: ${errText}`);
    }
    return res.json();
}

/* ---------- Splitting the file into an editable preamble + post objects ---------- */

function splitPreambleAndPosts(raw) {
    const text = raw.replace(/\r\n/g, "\n");
    const match = text.match(/^[ \t]*title[ \t]*:/im);
    const preambleEnd = match ? match.index : 0;
    const preamble = text.slice(0, preambleEnd).replace(/\n+$/, "");
    const posts = parsePosts(text.slice(preambleEnd));
    return { preamble, posts };
}

function buildFileContent(preamble, posts) {
    const body = posts.map(serializePost).join("\n\n");
    return `${preamble.trim()}\n\n${body}\n`;
}

/* ---------- App state ---------- */

let cachedPreamble = "";
let cachedPosts = [];
let cachedSha = null;

/* ---------- View elements ---------- */

const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");
const tokenInput = document.getElementById("tokenInput");
const rememberCheck = document.getElementById("rememberCheck");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

const postTitle = document.getElementById("postTitle");
const postDate = document.getElementById("postDate");
const postImage = document.getElementById("postImage");
const imgPreview = document.getElementById("imgPreview");
const postBody = document.getElementById("postBody");
const publishBtn = document.getElementById("publishBtn");
const publishStatus = document.getElementById("publishStatus");
const postsList = document.getElementById("postsList");

/* ---------- Login ---------- */

async function tryLogin(token) {
    loginError.textContent = "";
    loginBtn.disabled = true;
    loginBtn.textContent = "যাচাই করা হচ্ছে...";
    try {
        const res = await fetch(API_BASE, { headers: ghHeaders(token) });
        if (!res.ok) throw new Error("invalid");
        setToken(token, rememberCheck.checked);
        showAdmin();
    } catch (err) {
        loginError.textContent = "কোডটি সঠিক নয় অথবা অ্যাক্সেস নেই। আবার চেষ্টা করুন।";
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "লগইন করুন";
    }
}

loginBtn.addEventListener("click", () => {
    const token = tokenInput.value.trim();
    if (!token) {
        loginError.textContent = "অ্যাক্সেস কোড দিন।";
        return;
    }
    tryLogin(token);
});

tokenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loginBtn.click();
});

logoutBtn.addEventListener("click", () => {
    clearToken();
    location.reload();
});

function showAdmin() {
    loginView.style.display = "none";
    adminView.style.display = "block";
    postDate.value = defaultDateText();
    loadPostsList();
}

function defaultDateText() {
    try {
        return new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
    } catch {
        return new Date().toISOString().slice(0, 10);
    }
}

/* ---------- Image preview ---------- */

postImage.addEventListener("change", () => {
    const file = postImage.files[0];
    if (!file) {
        imgPreview.style.display = "none";
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        imgPreview.src = e.target.result;
        imgPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function sanitizeFilename(name) {
    return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
}

/* ---------- Publish ---------- */

publishBtn.addEventListener("click", async () => {
    const token = getToken();
    const title = postTitle.value.trim();
    const date = postDate.value.trim();
    const bodyText = postBody.value.trim();
    const imageFile = postImage.files[0];

    if (!title || !bodyText) {
        publishStatus.textContent = "শিরোনাম এবং লেখা দুটোই দিতে হবে।";
        publishStatus.className = "admin-status error";
        return;
    }

    publishBtn.disabled = true;
    publishStatus.className = "admin-status";

    try {
        let imagePath = "";
        if (imageFile) {
            publishStatus.textContent = "ছবি আপলোড হচ্ছে...";
            const base64 = await fileToBase64(imageFile);
            const filename = `${Date.now()}-${sanitizeFilename(imageFile.name)}`;
            imagePath = `${IMAGES_DIR}/${filename}`;
            await ghPutFile(imagePath, base64, `Upload blog image: ${filename}`, null, token);
        }

        publishStatus.textContent = "লেখা সংরক্ষণ করা হচ্ছে...";
        const current = await ghGetFile(POSTS_FILE, token);
        const { preamble, posts } = splitPreambleAndPosts(current ? current.content : "");

        const paragraphs = bodyText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
        posts.unshift({ title, date, image: imagePath, paragraphs });

        const newContent = buildFileContent(preamble, posts);
        await ghPutFile(POSTS_FILE, utf8ToBase64(newContent), `Add blog post: ${title}`, current ? current.sha : null, token);

        publishStatus.textContent = "✅ প্রকাশিত হয়েছে! ওয়েবসাইটে দেখা যেতে ১-২ মিনিট সময় লাগতে পারে।";
        postTitle.value = "";
        postBody.value = "";
        postImage.value = "";
        imgPreview.style.display = "none";
        postDate.value = defaultDateText();
        loadPostsList();
    } catch (err) {
        console.error(err);
        publishStatus.textContent = "সমস্যা হয়েছে, আবার চেষ্টা করুন। (" + err.message + ")";
        publishStatus.className = "admin-status error";
    } finally {
        publishBtn.disabled = false;
    }
});

/* ---------- Recent posts list + delete ---------- */

async function loadPostsList() {
    const token = getToken();
    postsList.innerHTML = `<p class="admin-status">লোড হচ্ছে...</p>`;
    try {
        const current = await ghGetFile(POSTS_FILE, token);
        const { posts } = splitPreambleAndPosts(current ? current.content : "");
        cachedPosts = posts;
        cachedSha = current ? current.sha : null;

        if (!posts.length) {
            postsList.innerHTML = `<p class="admin-status">এখনো কোনো পোস্ট নেই।</p>`;
            return;
        }

        postsList.innerHTML = "";
        posts.forEach((post, i) => {
            const row = document.createElement("div");
            row.className = "admin-post-row";
            row.innerHTML = `
                <div>
                    <strong>${escapeHtml(post.title)}</strong>
                    <span class="admin-post-date">${escapeHtml(post.date)}</span>
                </div>
                <button class="admin-delete-btn" data-index="${i}">মুছুন</button>
            `;
            postsList.appendChild(row);
        });

        postsList.querySelectorAll(".admin-delete-btn").forEach(btn => {
            btn.addEventListener("click", () => deletePost(parseInt(btn.dataset.index, 10)));
        });
    } catch (err) {
        console.error(err);
        postsList.innerHTML = `<p class="admin-status error">লিস্ট লোড করা যায়নি।</p>`;
    }
}

async function deletePost(index) {
    const token = getToken();
    const post = cachedPosts[index];
    if (!post) return;
    if (!confirm(`"${post.title}" পোস্টটি মুছে ফেলতে চান?`)) return;

    try {
        const current = await ghGetFile(POSTS_FILE, token);
        const { preamble, posts } = splitPreambleAndPosts(current.content);
        posts.splice(index, 1);
        const newContent = buildFileContent(preamble, posts);
        await ghPutFile(POSTS_FILE, utf8ToBase64(newContent), `Delete blog post: ${post.title}`, current.sha, token);
        loadPostsList();
    } catch (err) {
        console.error(err);
        alert("মুছে ফেলা যায়নি, আবার চেষ্টা করুন।");
    }
}

/* ---------- Init ---------- */

(function init() {
    const existing = getToken();
    if (existing) {
        tokenInput.value = existing;
        showAdmin();
    }
})();
