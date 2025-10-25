// ===== Tahun Otomatis =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== SIMULASI CTPS 20 DETIK =====
const simBtn = document.getElementById("simBtn");
const simProgress = document.getElementById("simProgress");
const simTime = document.getElementById("simTime");

// === Suara untuk simulasi ===
const simStartSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
const simTickSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
const simEndSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

if (simBtn) {
  simBtn.addEventListener("click", () => {
    let waktu = 20;
    simBtn.disabled = true;
    simProgress.style.width = "0%";
    simTime.textContent = waktu + "s";
    simStartSound.currentTime = 0;
    simStartSound.play();

    const interval = setInterval(() => {
      waktu--;
      simTime.textContent = waktu + "s";
      simProgress.style.width = ((20 - waktu) / 20) * 100 + "%";
      simTickSound.currentTime = 0;
      simTickSound.play();

      if (waktu <= 0) {
        clearInterval(interval);
        simEndSound.currentTime = 0;
        simEndSound.play();
        simBtn.disabled = false;
        simTime.textContent = "Selesai ✅";
        setTimeout(() => {
          simTime.textContent = "20s";
          simProgress.style.width = "0%";
        }, 2000);
      }
    }, 1000);
  });
}

// ===== Mode Gelap =====
document.getElementById('themeToggle').addEventListener('click', () => {
  const cur = document.body.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('ctps-theme', next);
});

// ===== Navigasi ke Quiz dari Tombol Home =====
document.getElementById("openQuizBtn").addEventListener("click", () => {
  document.getElementById("home").classList.remove("active");
  document.getElementById("quiz").classList.add("active");
});

// ===== KUIS =====
const qEl = document.getElementById('question'),
  optEl = document.getElementById('options'),
  startBtn = document.getElementById('startQuizBtn'),
  restartBtn = document.getElementById('restartQuizBtn'),
  timer = document.getElementById('timerNum'),
  chartEl = document.getElementById('scoreChart');

// === Suara efek kuis ===
const soundCorrect = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const soundWrong = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
const soundFinish = new Audio("https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg");

// === 20 Soal CTPS ===
const quiz = [
  { q: "Apa kepanjangan dari CTPS?", opts: ["Cuci Tangan Pakai Sabun", "Cuci Tubuh Pakai Sabun", "Cuci Tangan Pagi Siang", "Cuci Tangan Pakai Sikat"], a: 0 },
  { q: "Tujuan utama CTPS adalah untuk…", opts: ["Mengharumkan tangan", "Menghilangkan kotoran dan kuman", "Menyegarkan tubuh", "Membuat tangan lembut"], a: 1 },
  { q: "Berapa lama waktu ideal mencuci tangan menurut WHO?", opts: ["5 detik", "10 detik", "20 detik", "1 menit"], a: 2 },
  { q: "CTPS termasuk perilaku hidup bersih di lingkungan…", opts: ["Rumah", "Sekolah", "Masyarakat", "Semua benar"], a: 3 },
  { q: "CTPS dapat mencegah penyakit berikut, kecuali…", opts: ["Diare", "Tifus", "Flu", "Sakit mata karena kurang tidur"], a: 3 },
  { q: "Langkah pertama mencuci tangan adalah…", opts: ["Gunakan sabun", "Basahi tangan dengan air bersih", "Keringkan tangan", "Gosok punggung tangan"], a: 1 },
  { q: "Kapan sebaiknya mencuci tangan?", opts: ["Setelah makan", "Sebelum tidur", "Sebelum makan dan setelah dari toilet", "Setelah bermain"], a: 2 },
  { q: "CTPS adalah bagian dari program…", opts: ["PHBS", "K3", "UKS", "CSR"], a: 0 },
  { q: "Apa yang dibutuhkan untuk CTPS?", opts: ["Air bersih dan sabun", "Air saja", "Tisu basah", "Parfum tangan"], a: 0 },
  { q: "Berapa pilar dalam program STBM?", opts: ["3", "4", "5", "6"], a: 2 },
  { q: "CTPS merupakan pilar keberapa dalam STBM?", opts: ["1", "2", "3", "4"], a: 3 },
  { q: "Apa yang harus dilakukan setelah mencuci tangan?", opts: ["Mengeringkan dengan handuk bersih", "Membiarkan basah", "Mengibaskan", "Mengusap ke baju"], a: 0 },
  { q: "Waktu minimal mencuci tangan agar efektif adalah…", opts: ["10 detik", "15 detik", "20 detik", "30 detik"], a: 2 },
  { q: "Kuman paling banyak menempel di bagian…", opts: ["Telapak tangan", "Punggung tangan", "Sela jari", "Semua benar"], a: 3 },
  { q: "CTPS dapat menurunkan risiko diare hingga…", opts: ["10%", "25%", "40%", "60%"], a: 2 },
  { q: "Mengapa sabun penting saat mencuci tangan?", opts: ["Membunuh virus dan bakteri", "Membuat wangi", "Menghaluskan kulit", "Mendinginkan tangan"], a: 0 },
  { q: "Siapa yang dianjurkan melakukan CTPS?", opts: ["Anak-anak", "Orang dewasa", "Lansia", "Semua umur"], a: 3 },
  { q: "Kapan waktu penting untuk CTPS?", opts: ["Sebelum makan dan setelah BAB", "Saat lapar", "Setelah tidur", "Sebelum minum"], a: 0 },
  { q: "Manfaat CTPS bagi masyarakat adalah…", opts: ["Mencegah penularan penyakit", "Menambah berat badan", "Meningkatkan nafsu makan", "Menghemat air"], a: 0 },
  { q: "Apa yang dilakukan jika tidak ada sabun?", opts: ["Gunakan hand sanitizer", "Gunakan parfum", "Tidak usah cuci tangan", "Gunakan air saja"], a: 0 }
];

let cur = 0, score = 0, quizTimer = null, time = 5;
let scoreHistory = JSON.parse(localStorage.getItem("ctpsScores")) || [];

// ===== Efek getar (shake) =====
function shakeElement(el) {
  el.style.animation = "shake 0.4s";
  el.addEventListener("animationend", () => (el.style.animation = ""), { once: true });
}

// Tambahkan animasi shake via JS
const styleShake = document.createElement("style");
styleShake.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-8px); }
  40%,80% { transform: translateX(8px); }
}`;
document.head.appendChild(styleShake);

function renderQuiz() {
  chartEl.style.display = "none";
  if (cur >= quiz.length) {
    showResult();
    return;
  }
  const q = quiz[cur];
  qEl.textContent = q.q;
  optEl.innerHTML = "";
  q.opts.forEach((o, i) => {
    const b = document.createElement('button');
    b.textContent = o;
    b.onclick = () => ans(i, b);
    optEl.appendChild(b);
  });
  clearInterval(quizTimer);
  time = 5;
  timer.textContent = time;
  quizTimer = setInterval(() => {
    time--;
    timer.textContent = time;
    if (time <= 0) {
      clearInterval(quizTimer);
      cur++;
      renderQuiz();
    }
  }, 1000);
}

function ans(i, b) {
  clearInterval(quizTimer);
  const cor = quiz[cur].a;
  const all = optEl.querySelectorAll('button');
  all.forEach(btn => btn.disabled = true);
  if (i === cor) {
    b.classList.add('correct');
    score++;
    soundCorrect.currentTime = 0;
    soundCorrect.play();
  } else {
    b.classList.add('wrong');
    all[cor].classList.add('correct');
    soundWrong.currentTime = 0;
    soundWrong.play();
    shakeElement(optEl);
  }
  cur++;
  setTimeout(renderQuiz, 700);
}

function showResult() {
  soundFinish.play();
  scoreHistory.push(score);
  localStorage.setItem("ctpsScores", JSON.stringify(scoreHistory));

  const totalPemain = scoreHistory.length;
  const avg = (scoreHistory.reduce((a,b)=>a+b,0)/totalPemain).toFixed(2);

  qEl.innerHTML = `
    ✅ Kuis selesai!<br>
    <b>Skor kamu:</b> ${score}/${quiz.length}<br>
    <b>Rata-rata pemain:</b> ${avg}/${quiz.length}<br>
    <b>Jumlah pemain:</b> ${totalPemain} orang
  `;
  optEl.innerHTML = "";
  startBtn.style.display = "none";
  restartBtn.style.display = "inline";
  showChart();
}

function showChart() {
  chartEl.style.display = "block";
  const avg = scoreHistory.reduce((a,b)=>a+b,0)/scoreHistory.length;
  const ctx = chartEl.getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Skor Kamu", "Rata-rata Pemain"],
      datasets: [{
        data: [score, avg],
        backgroundColor: ["#089981", "#1ed5a4"]
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: quiz.length } },
      plugins: { legend: { display: false } },
      animation: { duration: 800 }
    }
  });
}

startBtn.onclick = () => { cur = 0; score = 0; renderQuiz(); };
restartBtn.onclick = () => { cur = 0; score = 0; renderQuiz(); };

// ===== Navigasi Antar Menu =====
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section");
  const navLinks = document.getElementById("navLinks");
  const hambtn = document.getElementById("hambtn");

  function showSection(id) {
    sections.forEach(sec => {
      if (sec.id === id) {
        sec.classList.add("active");
        sec.classList.remove("hidden");
      } else {
        sec.classList.remove("active");
        sec.classList.add("hidden");
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.dataset.section;
      showSection(target);
      if (window.innerWidth <= 780) navLinks.classList.remove("show");
    });
  });

  document.getElementById("openQuizBtn").addEventListener("click", () => {
    showSection("quiz");
  });

  if (hambtn && navLinks) {
    hambtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  showSection("home");
});
