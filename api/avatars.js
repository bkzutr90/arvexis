// Mengambil avatar + nama Roblox dari user ID (dipanggil oleh carousel Tim Arvexis).
// Dijalankan di server Vercel supaya tidak terkena batasan CORS Roblox.
module.exports = async (req, res) => {
  const ids = String(req.query.ids || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^\d{1,15}$/.test(s))
    .slice(0, 30);

  if (!ids.length) return res.status(400).json({ error: "Parameter ids kosong atau tidak valid" });

  try {
    const [thumbs, profiles] = await Promise.all([
      fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${ids.join(",")}&size=420x420&format=Png&isCircular=false`
      ).then((r) => r.json()),
      fetch("https://users.roblox.com/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: ids.map(Number), excludeBannedUsers: false }),
      }).then((r) => r.json()),
    ]);

    const img = new Map((thumbs.data || []).map((t) => [String(t.targetId), t.imageUrl || ""]));
    const prof = new Map((profiles.data || []).map((p) => [String(p.id), p]));

    const users = ids.map((id) => ({
      id,
      name: prof.get(id)?.name || "",
      displayName: prof.get(id)?.displayName || "",
      image: img.get(id) || "",
    }));

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ users });
  } catch (err) {
    res.status(502).json({ error: "Gagal mengambil data Roblox" });
  }
};
