// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcxZ2ITCBY_Xao__dO50f7SNBoEkli9DA",
  authDomain: "anon-comment-database.firebaseapp.com",
  projectId: "anon-comment-database",
  storageBucket: "anon-comment-database.firebasestorage.app",
  messagingSenderId: "924930380276",
  appId: "1:924930380276:web:5d31d466d4d510327fe9a1",
  measurementId: "G-ZHZ4CQ30VE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Live comment feed
const scrollBox = document.getElementById("comment-scroll");

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

const commentsQuery = query(
  collection(db, "comments"),
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
