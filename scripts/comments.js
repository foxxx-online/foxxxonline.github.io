// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgNinpupBYTGfsw7HASdFO3CFQFQNX5Vc",
  authDomain: "comments-f4548.firebaseapp.com",
  projectId: "comments-f4548",
  storageBucket: "comments-f4548.firebasestorage.app",
  messagingSenderId: "659010482018",
  appId: "1:659010482018:web:db2bce30096062ca54863b",
  measurementId: "G-VK5ZP55VFL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Basic HTML-escaping so someone can't post a comment containing
// script tags or markup that breaks the page.
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Live comment feed (only present on index.html)
const scrollBox = document.getElementById("comment-scroll");

if (scrollBox) {
  const commentsQuery = query(
    collection(db, "haus-comments"),
    orderBy("timestamp", "desc"),
    limit(100),
  );

  onSnapshot(
    commentsQuery,
    (snapshot) => {
      if (snapshot.empty) {
        scrollBox.innerHTML = '<p class="comment-empty">No comments yet.</p>';
        return;
      }

      scrollBox.innerHTML = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const ts = data.timestamp ? data.timestamp.toDate() : new Date();
          return `
        <div class="comment-item">
          ${escapeHTML(data.text)}
          <time>${timeAgo(ts)}</time>
        </div>
      `;
        })
        .join("");
    },
    (err) => {
      console.error(err);
      scrollBox.innerHTML =
        '<p class="comment-empty">Could not load comments.</p>';
    },
  );
}

// Anonymous comment form (only present on contact.html)
const commentForm = document.getElementById("comment-form");

if (commentForm) {
  const textArea = document.getElementById("comment-text");
  const statusEl = document.getElementById("comment-status");
  const submitBtn = document.getElementById("comment-submit");

  commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = textArea.value.trim();
    if (!text) return;

    submitBtn.disabled = true;
    statusEl.textContent = "Sending...";

    try {
      await addDoc(collection(db, "haus-comments"), {
        text,
        timestamp: serverTimestamp(),
      });
      textArea.value = "";
      statusEl.textContent = "Sent! Thank you uwu";
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Something went wrong. Please try again.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}
