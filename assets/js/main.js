// ====== PENGATURAN (edit di sini) ======
const CONFIG = {
  discordUrl: "https://discord.gg/mUshYXTfqu",

  // Foto galeri: taruh foto mabar di assets/img/gallery/ lalu tulis path-nya di sini
  // contoh: ["assets/img/gallery/mabar-1.jpg", "assets/img/gallery/mabar-2.jpg"]
  gallery: [],

  // Anggota tim kompetitif: id = Roblox user ID (angka di link profil roblox.com/users/ANGKA/profile)
  // contoh: [{ id: 123456789, role: "Captain" }, { id: 987654321, role: "Killer main" }]
  team: [{ id: 10013979972, role: "Survivor" }],
};
// =======================================

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

// ---- Carousel (tombol panah) ----
document.querySelectorAll("[data-for]").forEach((b) =>
  b.addEventListener("click", () => {
    const track = document.getElementById(b.dataset.for);
    const first = track.firstElementChild;
    if (first) track.scrollBy({ left: Number(b.dataset.dir) * (first.offsetWidth + 16), behavior: "smooth" });
  })
);

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};

// ---- Galeri ----
const gallery = document.getElementById("gallery");
if (CONFIG.gallery.length) {
  CONFIG.gallery.forEach((src) => {
    const img = el("img");
    img.src = src; img.alt = "Foto mabar Arvexis"; img.loading = "lazy";
    gallery.appendChild(img);
  });
} else {
  for (let i = 0; i < 3; i++) gallery.appendChild(el("div", "ph", "Foto mabar segera hadir"));
}

// ---- Tim Arvexis (avatar Roblox) ----
const teamTrack = document.getElementById("team");

function memberCard(m, info = {}) {
  const card = el("article", "member");
  const frame = el("div", "avatar");
  if (info.image) {
    const img = el("img");
    img.src = info.image; img.alt = `Avatar Roblox ${info.displayName || info.name || m.id}`; img.loading = "lazy";
    frame.appendChild(img);
  } else {
    frame.textContent = (m.name || info.displayName || info.name || "?").charAt(0).toUpperCase();
  }
  const body = el("div", "member-info");
  body.appendChild(el("h3", "", m.name || info.displayName || info.name || "Anggota"));
  if (info.name) body.appendChild(el("span", "handle", "@" + info.name));
  if (m.role) body.appendChild(el("span", "role", m.role));
  card.append(frame, body);
  return card;
}

async function loadTeam() {
  if (!CONFIG.team.length) {
    for (let i = 0; i < 3; i++) teamTrack.appendChild(el("div", "ph", "Anggota tim segera hadir"));
    return;
  }
  // tampilkan dulu kartu tanpa avatar, lalu isi setelah data Roblox datang
  CONFIG.team.forEach((m) => teamTrack.appendChild(memberCard(m)));
  try {
    const ids = CONFIG.team.map((m) => m.id).join(",");
    const res = await fetch(`/api/avatars?ids=${ids}`);
    if (!res.ok) throw new Error("API " + res.status);
    const { users } = await res.json();
    const byId = new Map(users.map((u) => [String(u.id), u]));
    teamTrack.replaceChildren(...CONFIG.team.map((m) => memberCard(m, byId.get(String(m.id)))));
  } catch (err) {
    console.warn("Avatar Roblox gagal dimuat:", err);
  }
}
loadTeam();

// ---- Tombol install aplikasi (PWA) ----
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
