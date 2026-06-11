import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, query, orderByChild, limitToFirst, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsZu1Cxy0D35qvwqvYvuX5IDFZp0KveBE",
  authDomain: "polytrackf1.firebaseapp.com",
  databaseURL: "https://polytrackf1-default-rtdb.firebaseio.com",
  projectId: "polytrackf1",
  storageBucket: "polytrackf1.firebasestorage.app",
  messagingSenderId: "950166898468",
  appId: "1:950166898468:web:a3e99bf5444518ccb755b1",
  measurementId: "G-VZ67RSJPFG"
};

const app = initializeApp(firebaseConfig );
const db = getDatabase(app);

// Function to submit a score
export async function submitScore(name, timeMs, trackId = "default") {
  if (!name || !timeMs) return;
  try {
    await push(ref(db, `leaderboards/${trackId}`), {
      name: name.slice(0, 20),
      timeMs: Number(timeMs),
      createdAt: serverTimestamp()
    });
    console.log("Score submitted!");
  } catch (e) {
    console.error("Error submitting score:", e);
  }
}

// Function to fetch the top 10 scores
export async function getTopScores(trackId = "default") {
  const q = query(ref(db, `leaderboards/${trackId}`), orderByChild("timeMs"), limitToFirst(10));
  const snapshot = await get(q);
  const scores = [];
  snapshot.forEach(child => {
    scores.push(child.val());
  });
  return scores.sort((a, b) => a.timeMs - b.timeMs);
}

// Make it available globally for the game to call
window.submitGameScore = submitScore;
window.getGameLeaderboard = getTopScores;
