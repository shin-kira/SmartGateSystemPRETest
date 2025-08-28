import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// ✅ Full Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyA_RsdlNL9CLIDr8kw5yGgNZCaBj3PxPBk",
    authDomain: "gate-pre.firebaseapp.com",
    databaseURL: "https://gate-pre-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gate-pre",
    storageBucket: "gate-pre.appspot.com",  
    messagingSenderId: "786412393457",
    appId: "1:786412393457:web:6226728a8cf5863073ea50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Reference the actual button
const loginButton = document.getElementById("log");

loginButton.addEventListener("click", function () {
    const usernameInput = document.getElementById("ownerid");
    const passwordInput = document.getElementById("guestid");
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const fail = document.getElementById("fail");

    // ✅ Validate inputs
    if (!username || !password) {
        fail.style.display = "block";
        fail.textContent = "Please enter email and password.";
        return;
    }

    // ✅ Firebase Authentication
    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // ✅ Login success - redirect
            window.location.href = "PRE guest webpage.html";
        })
        .catch((error) => {
            fail.style.display = "block";
            fail.style.color = "red";
            fail.style.fontSize = "16px";
            fail.textContent = "Invalid username or password. Please try again.";
            usernameInput.style.borderColor = "red";
            passwordInput.style.borderColor = "red";
            console.error("Login failed:", error.message);
        });
});
