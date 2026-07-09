/* =========================================================
   Shared helpers: parsing blog-posts.txt <-> post objects,
   and UTF-8 safe base64 encode/decode for the GitHub API.
   Used by both blog.js (public page) and admin.js (posting panel).
   ========================================================= */

function parsePosts(raw) {
    const text = raw.replace(/\r\n/g, "\n");
    // Posts are separated by a line containing only ===
    const blocks = text.split(/\n={3,}\s*\n/);

    const posts = [];
    for (const block of blocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;

        // Header (title/date/image) is separated from the body by a line of only ---
        const parts = trimmed.split(/\n-{3,}\s*\n/);
        if (parts.length < 2) continue; // not a real post block (e.g. the instructions box)

        const header = parts[0];
        const body = parts.slice(1).join("\n---\n");

        const fields = {};
        header.split("\n").forEach(line => {
            const match = line.match(/^\s*(title|date|image)\s*:\s*(.*)$/i);
            if (match) fields[match[1].toLowerCase()] = match[2].trim();
        });

        if (!fields.title) continue; // skip anything without a title (e.g. instructions text)

        const paragraphs = body
            .split(/\n\s*\n/)
            .map(p => p.trim())
            .filter(Boolean);

        posts.push({
            title: fields.title,
            date: fields.date || "",
            image: fields.image || "",
            paragraphs
        });
    }
    return posts;
}

// Turn a post object back into the plain-text block format.
function serializePost(post) {
    const body = post.paragraphs.join("\n\n");
    return `title: ${post.title}\ndate: ${post.date}\nimage: ${post.image || ""}\n---\n${body}\n===`;
}

function excerpt(text, max = 130) {
    if (text.length <= max) return text;
    return text.slice(0, max).trim() + "…";
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
}

/* ---------- UTF-8 safe base64 (needed for the GitHub Contents API) ---------- */

function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

function base64ToUtf8(b64) {
    const binary = atob(b64.replace(/\n/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}
