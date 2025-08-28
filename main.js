import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_RsdlNL9CLIDr8kw5yGgNZCaBj3PxPBk",
  authDomain: "gate-pre.firebaseapp.com",
  databaseURL: "https://gate-pre-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gate-pre",
  storageBucket: "gate-pre.appspot.com",
  messagingSenderId: "786412393457",
  appId: "1:786412393457:web:6226728a8cf5863073ea50"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const guestId = "guest123";
const guestRef = ref(db, `guests/${guestId}`);

const gatestate = {
  OTP: null,
  state: false,
  timestamp: null,
  validUntil: null
};

function playCustomWaveUltrasonic() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const sampleRate = audioCtx.sampleRate; 
  const duration = 5; 
  const frameCount = sampleRate * duration;

  const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  const freq = 23993.6; 
  const twoPi = 2 * Math.PI;

  for (let i = 0; i < frameCount; i++) {
    const t = i / sampleRate; 
    const x = twoPi * freq * t;
    let val = Math.sin(3 * x + 9) + Math.cos(9 * x + 6);
    val /= 2; 
    data[i] = val;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
}



document.addEventListener("DOMContentLoaded", () => {
  const gateButton = document.getElementById("gateAccsess");
  if (!gateButton) return;

  gateButton.addEventListener("click", () => {
    const otpExpiry = 20000; 

    gateButton.disabled = true; // ✅ Prevent spamming clicks

    gatestate.state = true;
    gatestate.OTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    gatestate.timestamp = Date.now();
    gatestate.validUntil = Date.now() + otpExpiry;

    playCustomWaveUltrasonic();

    update(guestRef, gatestate)
      .then(() => {
        console.log(`✅ Gate access granted! OTP: ${gatestate.OTP}`);

        // ✅ Auto reset after expiry
        setTimeout(() => {
          update(guestRef, { state: false, OTP: null })
            .then(() => console.log("✅ OTP expired, gate closed"))
            .catch(err => console.error("Error resetting gate:", err));
        }, 5000);
      })
      .catch(err => console.error("❌ Error updating gate access:", err));
  });
});
