import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDpxHHPC8oEz8A9SZCLm_CLiLd9ecnAyA",
  authDomain: "chinese-language-study-card.firebaseapp.com",
  projectId: "chinese-language-study-card",
  storageBucket: "chinese-language-study-card.firebasestorage.app",
  messagingSenderId: "135897393054",
  appId: "1:135897393054:web:c24816d1d45eb70ee4188f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const wordsRef = collection(db, "words");

// 認証状態の変化を監視
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("loggedIn").style.display = "block";
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("addSection").style.display = "block";
  } else {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("loggedIn").style.display = "none";
    document.getElementById("addSection").style.display = "none";
  }
  loadWords();
});

// ログイン
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    document.getElementById("authMessage").textContent = "ログイン失敗：" + e.message;
  }
});

// ログアウト
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth);
});

// 単語一覧を表示
async function loadWords() {
  const list = document.getElementById("wordList");
  list.innerHTML = "";
  const snapshot = await getDocs(wordsRef);
  const user = auth.currentUser;
  snapshot.forEach(docSnap => {
    const { hanzi, pinyin, meaning } = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${hanzi}</strong>（${pinyin}）― ${meaning}
      ${user ? `<button data-id="${docSnap.id}">削除</button>` : ""}
    `;
    if (user) {
      li.querySelector("button").addEventListener("click", () => deleteWord(docSnap.id));
    }
    list.appendChild(li);
  });
}

// 単語を登録
document.getElementById("addBtn").addEventListener("click", async () => {
  const hanzi = document.getElementById("hanzi").value.trim();
  const pinyin = document.getElementById("pinyin").value.trim();
  const meaning = document.getElementById("meaning").value.trim();
  const message = document.getElementById("message");

  if (!hanzi || !pinyin || !meaning) {
    message.textContent = "すべての項目を入力してください。";
    return;
  }

  await addDoc(wordsRef, { hanzi, pinyin, meaning, createdAt: serverTimestamp() });

  document.getElementById("hanzi").value = "";
  document.getElementById("pinyin").value = "";
  document.getElementById("meaning").value = "";
  message.textContent = "登録しました！";

  loadWords();
});

// 単語を削除
async function deleteWord(id) {
  await deleteDoc(doc(db, "words", id));
  loadWords();
}
