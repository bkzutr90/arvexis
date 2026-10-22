// ====== PENGATURAN (edit di sini) ======
const CONFIG = {
  // Ganti dengan link invite server Discord Arvexis kamu
  discordUrl: "https://discord.gg/GANTI-LINK-INVITE",
  // Foto galeri: taruh file di assets/img/gallery/ lalu tulis path-nya di sini
  gallery: ["assets/img/banner.jpg", "assets/img/logo.png"],
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
const gal = document.getElementById("gallery");
CONFIG.gallery.forEach((src) => {
  const img = document.createElement("img");
  img.src = src; img.alt = "Foto komunitas Arvexis"; img.loading = "lazy";
  gal.appendChild(img);
});

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
