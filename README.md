# Template Video Sejarah Dokumenter · Peristiwa Rengasdengklok (Remotion)

Template reel vertikal 9:16 (1080×1920, 30 fps, ±84 dtk) bergaya dokumenter: tokoh badan penuh bergerak seperti boneka potong (kepala menoleh pose → diam), judul dua warna di belakang kepala tokoh, keterangan nama gaya lower-third, kartu tanggal kalender sobek di ruang tua dengan lampu templek & jam antik, koran di meja, foto disematkan di dinding, figuran & latar hidup (parallax, kabut, debu), transisi zoom-blur + bocor cahaya, dan penutup ajakan.

Template oleh Maliki Saputra (@malikisaputra). Gratis dipakai dan diubah, kredit wajib tetap ada, tidak untuk diperjualbelikan.

## Cara pakai
1. Install [Node.js](https://nodejs.org) 18+.
2. Di folder ini: `npm install`
3. Pratinjau: `npm run studio` · Render: `npm run render` → `out/video.mp4`

## Mengganti cerita
- **Adegan & waktu**: daftar `ADEGAN` di `src/SejarahRengasdengklok.tsx` (tiap adegan punya `t` = detik mulai). Durasi total di `src/waktu.json` (`durasi`).
- **Suara (VO)**: tidak disertakan. Buat VO-mu (rekam sendiri/TTS), simpan `public/vo.wav`, ubah `PAKAI_VO = true`, lalu sesuaikan `t` tiap adegan dengan kalimatnya.
- **Tokoh**: buat gambar badan penuh (lihat `PROMPT.md` no. 2) → `public/sejarah-rdk/t-<nama>.png`. Potong latarnya jadi `t-<nama>-pot.png` (Mac: `swiftc -O alat/potong.swift -o potong && ./potong t-nama.png t-nama-pot.png`; atau situs penghapus latar mana pun), lalu `python3 alat/hitung_sendi.py <nama>` untuk titik leher. Pakai di adegan: `<AdeganTokoh nama="..." label="..." sub="..." judul={["BARIS 1", "BARIS 2"]} />`.
- **Figuran/benda bergerak**: potong lapisan depan (`alat/potong.swift` atau `alat/orang.swift` per orang) → `xxx-fg.png`, lalu `python3 alat/bersihkan_latar.py xxx.jpg xxx-fg.png` agar tidak ada bayangan ganda.
- **Kartu tanggal**: `<KartuTanggal atas="AGUSTUS 1945" besar="16" bawah="KAMIS" dari={["15", "RABU"]} jam={[4, 0]} />`.

## Isi folder
- `src/` kode · `public/sejarah-rdk/` gambar contoh · `public/sfx/` efek & musik · `alat/` skrip bantu · `PROMPT.md` semua prompt.

## Catatan sumber & etika
- Foto tokoh asli: arsip publik Wikimedia Commons (domain publik; foto Hatta 1950 CC BY 4.0), direstorasi. Badan penuh & suasana = ilustrasi AI — beri label "ilustrasi AI" di video.
- Riset fakta dari buku & jurnal, bukan hanya berita. Sumber cerita ini: Sejarah Nasional Indonesia VI (via Setneg), memoar Hatta & Soebardjo, Anderson (1972), Kahin (1952), Han Bing Siong (BKI 2000), Febrianti (JEJAK 2024).
- Jangan tampilkan tokoh nyata melakukan/berkata hal yang tidak tercatat sejarah.
