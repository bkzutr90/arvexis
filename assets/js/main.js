// ====== PENGATURAN (edit di sini) ======
const CONFIG = {
  // Ganti dengan link invite server Discord Arvexis kamu
  discordUrl: "https://discord.gg/GANTI-LINK-INVITE",
  // Foto galeri: taruh foto mabar di assets/img/gallery/ lalu tulis path-nya di sini
  // contoh: ["assets/img/gallery/mabar-1.jpg", "assets/img/gallery/mabar-2.jpg"]
  gallery: [],
};
// =======================================

// Semua tombol/link dengan atribut data-discord memakai link yang sama
document.querySelectorAll("[data-discord]").forEach((el) => {
  el.href = CONFIG.discordUrl;
  el.target = "_blank";
  el.rel = "noopener";
});

// Menu mobile
const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
btn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  btn.setAttribute("aria-expanded", String(open));
});
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

// Galeri
const track = document.getElementById("gallery");
const items = CONFIG.gallery.length ? CONFIG.gallery : [null, null, null];
items.forEach((src) => {
  if (src) {
    const img = document.createElement("img");
    img.src = src; img.alt = "Foto mabar Arvexis"; img.loading = "lazy";
    track.appendChild(img);
  } else {
    const ph = document.createElement("div");
    ph.className = "ph"; ph.textContent = "Foto mabar segera hadir";
    track.appendChild(ph);
  }
});
document.querySelectorAll("[data-gal]").forEach((b) =>
  b.addEventListener("click", () =>
    track.scrollBy({ left: Number(b.dataset.gal) * (track.firstElementChild.offsetWidth + 16), behavior: "smooth" })
  )
);

// Tombol install aplikasi (PWA)
let promptEvt;
const installBtn = document.getElementById("install");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); promptEvt = e; installBtn.hidden = false;
});
installBtn.addEventListener("click", async () => {
  if (!promptEvt) return;
  promptEvt.prompt(); await promptEvt.userChoice;
  promptEvt = null; installBtn.hidden = true;
});
