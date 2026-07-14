/* =========================================================
   CONTENT LOADER
   ---------------------------------------------------------
   Loads editable site content from Firestore and applies it
   to any element carrying a data-edit="path.to.field"
   attribute. If Firestore is unreachable or a field hasn't
   been edited yet, the page simply keeps whatever text is
   already hardcoded in the HTML — nothing breaks.

   Used by index.html, contact.html, timeline.html, and
   admin.html.
   ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const CONTENT_DOC = doc(db, "site", "content");

// Default content = exactly what's currently hardcoded on the pages.
// This is the fallback used until the client saves their first edit.
export const DEFAULT_CONTENT = {
  hero: {
    title: "Precise Care for Your Wellbeing",
    sub: "Nearly 10 years of experience — specializing in head-neck cancer surgery, micro-ear surgery, facial cosmetic surgery, and sleep apnea surgery.",
    role: "Dr. Md. Robiul Islam (Rony) — MBBS, DLO (ENT, BSMMU), Assistant Professor, Department of ENT & Head-Neck Surgery, Kumudini Women's Medical College & Hospital"
  },
  contact: {
    phone: "01710-258974",
    email: "ronykyamc@gmail.com",
    hours: "Daily 11:00 AM - 8:00 PM",
    address: "Hospital Road, Sadar, Sherpur"
  },
  schedule: [
    { day: "Monday", time: "4:00 PM - 8:00 PM", location: "Uttara Specialized Hospital, Savar" },
    { day: "Tuesday", time: "8:00 PM", location: "Kumudini Women's Medical College & Hospital" },
    { day: "Tuesday, Wednesday, Thursday", time: "10:00 AM", location: "Jamalpur Uchcharas Hospital" },
    { day: "Wednesday, Saturday, Sunday", time: "2:00 PM - 8:00 PM", location: "Proyukti Diagnostic Center" }
  ],
  timeline: [
    { year: 1988, type: "birth", title: "Birth", description: "Born in Shitol Kursha village, Jamalpur district.", image: "", estimated: false },
    { year: 2005, type: "education", title: "Passed SSC", description: "Passed the SSC examination from Jamalpur Zilla School.", image: "", estimated: false },
    { year: 2007, type: "education", title: "Passed HSC", description: "Completed HSC from Government Ashek Mahmud College.", image: "", estimated: false },
    { year: 2013, type: "education", title: "Completed MBBS", description: "Completed MBBS degree from Khwaja Yunus Ali Medical College, under Rajshahi University.", image: "", estimated: true },
    { year: 2014, type: "career", title: "Joined as Medical Officer", description: "Began his career as a Medical Officer in the Orthopedics department.", image: "", estimated: true },
    { year: 2015, type: "education", title: "Began Higher Studies — ENT", description: "Enrolled at Sir Salimullah Medical College for higher studies in ENT (Ear, Nose & Throat).", image: "", estimated: true },
    { year: 2017, type: "career", title: "Joined as Registrar", description: "Joined as Registrar at Kumudini Women's Medical College, Tangail.", image: "", estimated: false },
    { year: 2019, type: "career", title: "Joined as ENT Specialist", description: "Joined Khwaja Yunus Ali Medical College as an ENT Specialist.", image: "", estimated: false },
    { year: 2021, type: "career", title: "Joined as Assistant Professor", description: "Rejoined Kumudini Women's Medical College, Tangail, as Assistant Professor.", image: "", estimated: false }
  ]
};

function getByPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// Deep-merge saved content over the defaults, so a page never
// ends up missing a field just because it wasn't edited yet.
function mergeContent(base, saved) {
  const out = JSON.parse(JSON.stringify(base));
  if (!saved) return out;
  if (saved.hero) Object.assign(out.hero, saved.hero);
  if (saved.contact) Object.assign(out.contact, saved.contact);
  if (Array.isArray(saved.schedule)) out.schedule = saved.schedule;
  if (Array.isArray(saved.timeline)) out.timeline = saved.timeline;
  return out;
}

export async function loadContent() {
  try {
    const snap = await getDoc(CONTENT_DOC);
    return mergeContent(DEFAULT_CONTENT, snap.exists() ? snap.data() : null);
  } catch (err) {
    console.warn("Could not reach Firestore, using page defaults.", err);
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(content) {
  await setDoc(CONTENT_DOC, content);
}

// Applies simple text fields (data-edit="hero.title" etc.) to the DOM.
// Call this after loadContent() on the public-facing pages.
export function applyTextFields(content) {
  document.querySelectorAll("[data-edit]").forEach(el => {
    const value = getByPath(content, el.getAttribute("data-edit"));
    if (value !== undefined) el.textContent = value;
  });
}
