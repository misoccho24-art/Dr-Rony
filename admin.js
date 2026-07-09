/* =========================================================
   Blog admin panel styling
   ========================================================= */

.admin-body {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 16px;
}

.admin-wrap {
  width: 100%;
  max-width: 560px;
}

.admin-card {
  background: var(--ink-panel);
  border: 1px solid var(--line);
  padding: 40px;
}

.admin-title {
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--ivory);
  margin: 8px 0 14px;
}

.admin-subtitle {
  font-family: "Noto Serif Bengali", var(--font-display);
  font-size: 18px;
  color: var(--gold-light);
  margin: 0 0 16px;
}

.admin-sub {
  font-family: "Noto Sans Bengali", var(--font-body);
  color: var(--ivory-soft);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 26px;
}

.admin-label {
  display: block;
  font-family: "Noto Sans Bengali", var(--font-body);
  font-size: 13px;
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 18px 0 8px;
}

.admin-input, .admin-textarea {
  width: 100%;
  background: var(--ink-panel-2);
  border: 1px solid var(--line);
  color: var(--ivory);
  padding: 12px 14px;
  font-family: "Noto Sans Bengali", var(--font-body);
  font-size: 15px;
}

.admin-input:focus, .admin-textarea:focus {
  outline: none;
  border-color: var(--gold);
}

.admin-textarea { resize: vertical; line-height: 1.7; }

.admin-file {
  width: 100%;
  color: var(--ivory-soft);
  font-family: var(--font-body);
  font-size: 13px;
}

.admin-img-preview {
  margin-top: 12px;
  max-height: 200px;
  border: 1px solid var(--line);
}

.admin-check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-family: "Noto Sans Bengali", var(--font-body);
  color: var(--ivory-soft);
  font-size: 14px;
  cursor: pointer;
}

.admin-btn {
  display: block;
  width: 100%;
  text-align: center;
  border: none;
  cursor: pointer;
  margin-top: 24px;
  font-family: "Noto Sans Bengali", var(--font-body);
  font-size: 15px;
}

.admin-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.admin-error, .admin-status {
  font-family: "Noto Sans Bengali", var(--font-body);
  font-size: 13px;
  color: var(--ivory-faint);
  margin-top: 14px;
  min-height: 18px;
}

.admin-error { color: #e07a7a; }
.admin-status.error { color: #e07a7a; }

.admin-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.admin-logout {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ivory-soft);
  padding: 8px 16px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 13px;
  white-space: nowrap;
}

.admin-logout:hover { border-color: var(--gold); color: var(--gold-light); }

.admin-divider {
  height: 1px;
  background: var(--line);
  margin: 36px 0 26px;
}

.admin-posts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-post-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--ink-panel-2);
  border: 1px solid var(--line);
  padding: 12px 16px;
  font-family: "Noto Sans Bengali", var(--font-body);
}

.admin-post-row strong {
  color: var(--ivory);
  font-size: 14px;
  display: block;
}

.admin-post-date {
  color: var(--ivory-faint);
  font-size: 12px;
}

.admin-delete-btn {
  background: transparent;
  border: 1px solid rgba(224, 122, 122, 0.4);
  color: #e07a7a;
  padding: 6px 14px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 12px;
  white-space: nowrap;
}

.admin-delete-btn:hover { background: rgba(224, 122, 122, 0.12); }

@media (max-width: 640px) {
  .admin-card { padding: 28px 22px; }
  .admin-head { flex-direction: column; }
}
