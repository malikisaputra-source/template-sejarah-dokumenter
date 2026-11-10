// Sejarah · Peristiwa Rengasdengklok (10 Nov 2026). Mengikuti POLA reel dokumenter acuan (earn.edits), bukan rupanya:
// tokoh cutout berdiri di depan latar, kartu tanggal bergaris merah, tangan memegang koran (judul stabilo + foto heksagon
// berbingkai merah + label nama), satu kata 3D di latar grid biru, penonton dari belakang, foto disematkan di dinding,
// close-up hitam-putih goyang, intip lubang kunci, transisi blur.
// Foto tokoh = arsip publik Wikimedia Commons, direstorasi HD (ChatGPT Maliki) & dipotong latarnya (Vision macOS).
// Suasana & badan penuh = ilustrasi AI (ChatGPT Maliki), diberi label. Naskah+sumber: naskah/sejarah-rengasdengklok*.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as muatInter } from "@remotion/google-fonts/Inter";
import { loadFont as muatArchivo } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as muatSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as muatOswald } from "@remotion/google-fonts/Oswald";
import waktu from "./waktu.json";
import BONEKA from "./boneka-rdk.json";

// ---- pengaturan suara ----
// VO tidak disertakan (rekam/generate suaramu sendiri). Taruh di public/vo.wav lalu ubah ke true.
// Durasi video & waktu tiap adegan ada di src/waktu.json dan nilai `t` di daftar ADEGAN.
const PAKAI_VO = false;
const MUSIK = "sfx/musik-v3-4-sinematik.mp3";
const Sfx: React.FC<{ nama: string; f: number; vol?: number; lama?: number }> = ({ nama, f, vol = 0.3, lama }) => (
  <Sequence from={f} durationInFrames={lama} layout="none"><Audio src={staticFile(`sfx/${nama}.mp3`)} volume={vol} /></Sequence>
);

const INTER = muatInter().fontFamily;
const ARCHIVO = muatArchivo().fontFamily;
const SERIF = muatSerif("italic").fontFamily;
const SERIF_TEGAK = muatSerif("normal").fontFamily;
const OSWALD = muatOswald().fontFamily;
const FPS = 30;
const MERAH = "#d0281f", KREM = "#efe6d2", KUNING = "#ffe14d";
const E = Easing.bezier(0.22, 1, 0.36, 1);
const k = (f: number, a: number, b: number, d: number[], ease = E) =>
  interpolate(f, [a, b], d, { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const F = (n: string) => staticFile(`sejarah-rdk/${n}`);
const s2f = (s: number) => Math.round(s * FPS);
const sp = (f: number, d: number, c = { damping: 14, stiffness: 160 }) => spring({ frame: f - d, fps: FPS, config: c });

export const DURASI_RDK = Math.ceil((waktu.durasi + 1.2) * FPS);

// badan penuh hasil buat ulang AI (null = pakai potongan potret)
const TUBUH: string | null = "tubuh-pot.png";

// ---------- komponen dasar ----------
const Penuh: React.FC<{ src: string; z?: [number, number]; lama: number; f: number; filter?: string; pos?: string }> = ({ src, z = [1.12, 1], lama, f, filter = "", pos = "50% 50%" }) => (
  <Img src={F(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: pos,
    transform: `scale(${interpolate(f, [0, lama * FPS], z, { extrapolateRight: "clamp" })})`, filter }} />
);
const Gelap: React.FC<{ atas?: number; bawah?: number }> = ({ atas = 0.45, bawah = 0.8 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(rgba(0,0,0,${atas}), transparent 28%, transparent 52%, rgba(0,0,0,${bawah}))` }} />
);
const goyang = (f: number, a = 6) => `translate(${Math.sin(f * 0.9) * a + Math.sin(f * 2.3) * a * 0.4}px, ${Math.cos(f * 0.7) * a * 0.8}px) rotate(${Math.sin(f * 0.5) * 0.6}deg)`;

// keterangan gaya lower-third dokumenter: garis merah tipis, nama condensed, keterangan serif miring
const Pil: React.FC<{ teks: string; sub?: string; x: number; y: number; f: number; d: number; besar?: number }> = ({ teks, sub, x, y, f, d, besar = 50 }) => {
  const a = k(f, d, d + 14, [0, 1]);
  const b = k(f, d + 6, d + 20, [0, 1]);
  const u = Math.min(1, besar / 50);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "stretch", opacity: a, transform: `translateX(${(1 - a) * -40}px)` }}>
      <div style={{ width: 6, background: MERAH, transformOrigin: "top", transform: `scaleY(${a})`, boxShadow: "0 0 18px rgba(208,40,31,0.6)" }} />
      <div style={{ padding: "10px 22px 12px 18px", background: "linear-gradient(90deg, rgba(8,6,4,0.72), rgba(8,6,4,0.35) 75%, transparent)" }}>
        <div style={{ fontFamily: OSWALD, fontWeight: 600, fontSize: 52 * u, letterSpacing: 3, color: "#f6efe2", textTransform: "uppercase", lineHeight: 1.05, whiteSpace: "nowrap", textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>{teks}</div>
        {sub && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30 * u, color: "rgba(239,230,210,0.88)", marginTop: 2, whiteSpace: "nowrap", opacity: b, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{sub}</div>}
      </div>
    </div>
  );
};

const Judul: React.FC<{ teks: string; y: number; f: number; d: number; ukuran?: number; warna?: string }> = ({ teks, y, f, d, ukuran = 100, warna = KREM }) => (
  <div style={{ position: "absolute", left: 100, width: 800, top: y, textAlign: "center", whiteSpace: "pre-line", transform: `scale(${sp(f, d, { damping: 11, stiffness: 190 })})`,
    fontFamily: ARCHIVO, fontSize: ukuran, lineHeight: 1.0, color: warna, textShadow: "0 8px 30px rgba(0,0,0,0.9), 0 3px 0 rgba(0,0,0,0.6)" }}>{teks}</div>
);

// ---------- "hidup": kepala bergerak (pivot leher), napas, goyang (pengganti image-to-video, gratis) ----------
type Kepala = { x0: number; x1: number; leher: number; fase?: number }; // pecahan lebar/tinggi gambar
const ASPEK: Record<string, number> = { "tubuh-pot.png": 1024 / 1536 };
const KEPALA: Record<string, Kepala[]> = {
  "tubuh-pot.png": [{ x0: 0.17, x1: 0.47, leher: 0.205, fase: 0 }, { x0: 0.5, x1: 0.8, leher: 0.215, fase: 2.1 }],
  "soekarno-pot.png": [{ x0: 0.15, x1: 0.85, leher: 0.66 }],
  "hatta-pot.png": [{ x0: 0.3, x1: 0.85, leher: 0.6, fase: 1.3 }],
  "soebardjo-pot.png": [{ x0: 0.12, x1: 0.88, leher: 0.64, fase: 0.7 }],
  "maeda-pot.png": [{ x0: 0.4, x1: 0.62, leher: 0.15, fase: 2.6 }],
};
const Hidup: React.FC<{ src: string; h: number; f: number; kuat?: number; filter?: string }> = ({ src, h, f, kuat = 1, filter = "" }) => {
  const w = h * (ASPEK[src] ?? 1);
  const napas = 1 + Math.sin(f / 22) * 0.006 * kuat;
  return (
    <div style={{ position: "relative", width: w, height: h, transform: `scaleY(${napas})`, transformOrigin: "50% 100%", filter }}>
      <Img src={F(src)} style={{ position: "absolute", inset: 0, width: w, height: h }} />
      {(KEPALA[src] ?? []).map((kp, i) => {
        const fa = kp.fase ?? 0;
        // gerak kepala: menoleh pelan + mengangguk kecil, kadang "melirik"
        const rot = (Math.sin(f / 37 + fa) * 1.6 + Math.sin(f / 13 + fa * 2) * 0.5) * kuat;
        const ty = (Math.sin(f / 29 + fa) * 2.2) * kuat;
        const tx = (Math.sin(f / 41 + fa) * 3) * kuat;
        const cx = ((kp.x0 + kp.x1) / 2) * w, cy = kp.leher * h;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, clipPath: `polygon(${kp.x0 * 100}% 0, ${kp.x1 * 100}% 0, ${kp.x1 * 100}% ${kp.leher * 100}%, ${kp.x0 * 100}% ${kp.leher * 100}%)`,
            transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
            <Img src={F(src)} style={{ position: "absolute", inset: 0, width: w, height: h }} />
          </div>
        );
      })}
    </div>
  );
};

const Cutout: React.FC<{ src: string; x: number; y: number; h: number; f: number; d: number; dari?: "bawah" | "kiri" | "kanan" }> = ({ src, x, y, h, f, d, dari = "bawah" }) => {
  const s = sp(f, d, { damping: 16, stiffness: 110 });
  const t = dari === "bawah" ? `translateY(${(1 - s) * 700}px)` : `translateX(${(1 - s) * (dari === "kiri" ? -900 : 900)}px)`;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `${t} translateX(${Math.sin(f / 50) * 6}px)` }}>
      <Hidup src={src} h={h} f={f} filter="grayscale(0.4) sepia(0.25) contrast(1.05) drop-shadow(0 30px 40px rgba(0,0,0,0.7))" />
    </div>
  );
};

// latar berlapis: belakang bergeser pelan, orang/benda depan bergoyang & bernapas (parallax)
const Lapis: React.FC<{ bg: string; fg: string; f: number; lama: number; z?: [number, number]; gerak?: "goyang" | "melaju" | "kibar" | "ayun" | "pegang"; filter?: string }> = ({ bg, fg, f, lama, z = [1.12, 1.0], gerak = "goyang", filter = "" }) => {
  const zb = interpolate(f, [0, lama * FPS], z);
  const zf = interpolate(f, [0, lama * FPS], [z[0] + 0.06, z[1] + 0.1]);
  let tf = "";
  if (gerak === "goyang") tf = `translate(${Math.sin(f / 31) * 6}px, ${Math.sin(f / 19) * 3}px) scaleY(${1 + Math.sin(f / 21) * 0.006})`;
  if (gerak === "melaju") tf = `translate(${Math.sin(f / 2.5) * 1.5}px, ${interpolate(f, [0, lama * FPS], [0, -70]) + Math.abs(Math.sin(f / 3)) * 3}px) scale(${interpolate(f, [0, lama * FPS], [1, 0.72])})`;
  if (gerak === "kibar") tf = `skewY(${Math.sin(f / 7) * 1.4}deg) translateX(${Math.sin(f / 9) * 5}px)`;
  if (gerak === "ayun") tf = `rotate(${Math.sin(f / 14) * 2.5}deg)`;
  if (gerak === "pegang") tf = `translate(${Math.sin(f / 23) * 7}px, ${Math.sin(f / 17) * 5}px) rotate(${Math.sin(f / 29) * 0.8}deg)`;
  return (
    <AbsoluteFill style={{ filter }}>
      <Img src={F(bg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zb})` }} />
      <AbsoluteFill style={{ transform: `scale(${zf})` }}>
        <Img src={F(fg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: tf, transformOrigin: gerak === "ayun" ? "50% 0%" : gerak === "melaju" ? "57% 64%" : "50% 100%" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// kerumunan: tiap figuran = potongan kolom dari lapisan depan, bergerak sendiri (napas, goyang, kepala)
type Figuran = { x0: number; x1: number; leher: number; y1?: number };
const FIGURAN: Record<string, Figuran[]> = {
  "ai32-fg.png": [{ x0: 0, x1: 0.3, leher: 0.53 }, { x0: 0.3, x1: 0.73, leher: 0.53 }, { x0: 0.73, x1: 1, leher: 0.53 }],
  "ai33-fg.png": [{ x0: 0, x1: 0.26, leher: 0.52 }, { x0: 0.26, x1: 0.6, leher: 0.69 }, { x0: 0.6, x1: 0.83, leher: 0.8 }, { x0: 0.83, x1: 1, leher: 0.63 }],
};
const Kerumunan: React.FC<{ bg: string; fg: string; f: number; lama: number; z?: [number, number]; bokeh?: number }> = ({ bg, fg, f, lama, z = [1.15, 1.0], bokeh = 3 }) => {
  const zb = interpolate(f, [0, lama * FPS], z);
  const zf = interpolate(f, [0, lama * FPS], [z[0] + 0.05, z[1] + 0.09]);
  const lapis = (kp: Figuran, i: number) => {
    const fa = i * 1.7 + 0.4;
    const napas = 1 + Math.sin(f / (18 + i * 3) + fa) * 0.01;
    const goy = Math.sin(f / (27 + i * 5) + fa) * 5;
    const rot = Math.sin(f / (33 + i * 4) + fa) * 2 + Math.sin(f / 11 + fa * 3) * 0.6;
    const ang = Math.sin(f / (24 + i * 3) + fa) * 3;
    const cx = (kp.x0 + kp.x1) / 2;
    const potong = (y0: number, y1: number) => `polygon(${kp.x0 * 100}% ${y0 * 100}%, ${kp.x1 * 100}% ${y0 * 100}%, ${kp.x1 * 100}% ${y1 * 100}%, ${kp.x0 * 100}% ${y1 * 100}%)`;
    return (
      <AbsoluteFill key={i} style={{ transform: `translateX(${goy}px) scaleY(${napas})`, transformOrigin: `${cx * 100}% 100%` }}>
        <AbsoluteFill style={{ clipPath: potong(kp.leher - 0.005, 1) }}><Img src={F(fg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
        <AbsoluteFill style={{ clipPath: potong(0, kp.leher), transform: `translateY(${ang}px) rotate(${rot}deg)`, transformOrigin: `${cx * 100}% ${kp.leher * 100}%` }}>
          <Img src={F(fg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  };
  return (
    <AbsoluteFill>
      <Img src={F(bg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zb * 1.04}) translateX(${Math.sin(f / 80) * 10}px)`, filter: `blur(${bokeh}px)` }} />
      {/* cahaya/awan bergerak di latar */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.35, background: `radial-gradient(ellipse 50% 22% at ${(f * 0.25) % 140 - 20}% 18%, rgba(255,220,170,0.8), transparent 70%), radial-gradient(ellipse 40% 18% at ${110 - ((f * 0.18) % 140)}% 28%, rgba(255,200,150,0.6), transparent 70%)` }} />
      <AbsoluteFill style={{ transform: `scale(${zf})`, transformOrigin: "50% 100%" }}>
        {(FIGURAN[fg] ?? []).map(lapis)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// naskah proklamasi diketik, dilihat dari atas (padanan adegan benda bergerak di acuan). Teks ketikan asli 1945 (domain publik).
const NASKAH = "PROKLAMASI\n\nKami bangsa Indonesia dengan ini menjatakan kemerdekaan Indonesia.\nHal2 jang mengenai pemindahan kekoeasaan d.l.l., diselenggarakan dengan tjara saksama dan dalam tempo jang sesingkat-singkatnja.\n\nDjakarta, hari 17 boelan 8 tahoen 05\nAtas nama bangsa Indonesia.\nSoekarno/Hatta.";
const Ketik: React.FC<{ f: number; lama: number }> = ({ f, lama }) => {
  const n = Math.floor(k(f, 6, lama * FPS - 6, [0, NASKAH.length], Easing.linear));
  const kursor = Math.floor(f / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120d08" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, lama * FPS], [1.25, 1.05])}) rotate(${interpolate(f, [0, lama * FPS], [-6, -2])}deg)` }}>
        <Img src={F("ai34.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) sepia(0.3)" }} />
        <div style={{ position: "absolute", left: 170, top: 420, width: 740, height: 1000, background: "linear-gradient(170deg,#f1e7cf,#e2d5b5)", boxShadow: "0 40px 80px rgba(0,0,0,0.7)", padding: "70px 60px", transform: "rotate(-1deg)" }}>
          <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 30, lineHeight: 1.55, color: "#1c1a17", whiteSpace: "pre-wrap", textShadow: "0 0 0.6px #1c1a17" }}>
            {NASKAH.slice(0, n).split("\n").map((b, i) => <div key={i} style={{ textAlign: i === 0 ? "center" : "left", fontWeight: i === 0 ? 700 : 400, textDecoration: i === 0 ? "underline" : "none", minHeight: 46 }}>{b}</div>)}
            {kursor && <span style={{ background: "#1c1a17", width: 16, height: 30, display: "inline-block" }} />}
          </div>
        </div>
      </AbsoluteFill>
      {/* bayangan lampu bergoyang */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at ${50 + Math.sin(f / 18) * 8}% ${40 + Math.cos(f / 22) * 5}%, transparent 30%, rgba(0,0,0,0.65) 85%)` }} />
      <div style={{ position: "absolute", left: 110, top: 300, fontFamily: INTER, fontSize: 22, color: "rgba(255,255,255,0.75)" }}>teks naskah ketikan asli · adegan rekonstruksi</div>
    </AbsoluteFill>
  );
};

// ---------- boneka potong (pola acuan: kepala & lengan dipotong lalu digoyang pada sendi, seperti mainan kayu) ----------
type Sendi = { W: number; H: number; leher: number; kx0: number; kx1: number; bahu: number; tangan: number; lx0: number; lx1: number; rx0: number; rx1: number };
const Boneka: React.FC<{ nama: keyof typeof BONEKA; h: number; f: number; fase?: number }> = ({ nama, h, f, fase = 0 }) => {
  const g = BONEKA[nama] as Sendi;
  const w = (h * g.W) / g.H;
  const src = F(`t-${nama}-pot.png`);
  const img = <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: w, height: h }} />;
  const kotak = (x0: number, x1: number, y0: number, y1: number) => `polygon(${x0 * 100}% ${y0 * 100}%, ${x1 * 100}% ${y0 * 100}%, ${x1 * 100}% ${y1 * 100}%, ${x0 * 100}% ${y1 * 100}%)`;
  // gerak: kepala menoleh/mengangguk, lengan berayun bergantian, badan bernapas & bergoyang
  // pose → diam → pose lain (bukan bergoyang terus), seperti acuan
  const POSE = [0, -6, -6, 5, 5, 0, -3, 4];
  const seg = 34, i0 = Math.floor((f + fase * 7) / seg), u = ((f + fase * 7) % seg) / 9;
  const ke = (n: number) => POSE[((n % POSE.length) + POSE.length) % POSE.length];
  const kep = ke(i0 - 1) + (ke(i0) - ke(i0 - 1)) * Easing.inOut(Easing.cubic)(Math.min(1, u));
  const angguk = Math.abs(ke(i0) - ke(i0 - 1)) > 0 && u < 1 ? Math.sin(u * Math.PI) * 5 : 0;
  const napas = 1 + Math.sin(f / 20 + fase) * 0.008;
  return (
    <div style={{ position: "relative", width: w, height: h, transform: `rotate(${Math.sin(f / 37 + fase) * 1.2}deg) scaleY(${napas})`, transformOrigin: "50% 100%" }}>
      {/* badan tanpa lengan & kepala */}
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(0 ${g.leher * 100}%, 100% ${g.leher * 100}%, 100% 100%, 0 100%)` }}>{img}</div>
      {/* kepala */}
      <div style={{ position: "absolute", inset: 0, clipPath: kotak(g.kx0, g.kx1, 0, g.leher + 0.012), transform: `translateY(${angguk * 0.4}px) rotate(${kep}deg)`, transformOrigin: `${((g.kx0 + g.kx1) / 2) * w}px ${g.leher * h}px` }}>{img}</div>
    </div>
  );
};

// adegan tokoh: latar foto AI kabur (bokeh) + boneka di depan + pil nama merah di tengah (pola "Darya")
const AdeganTokoh: React.FC<{ nama: keyof typeof BONEKA; label: string; sub?: string; f: number; lama: number; pilY?: number; judul?: [string, string] }> = ({ nama, label, sub, f, lama, pilY = 1330, judul }) => {
  const s = sp(f, 0, { damping: 16, stiffness: 110 });
  const z = interpolate(f, [0, lama * FPS], [1.0, 1.08]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* latar & boneka satu kamera: boneka tepat menutupi orang di latar kabur */}
      <AbsoluteFill style={{ transform: `scale(${z}) translateX(${Math.sin(f / 70) * 8}px)`, transformOrigin: "50% 60%" }}>
        <Img src={F(`t-${nama}.png`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px) brightness(0.8)", transform: "scale(1.02)" }} />
        <Debu f={f} n={25} />
        {judul && <div style={{ position: "absolute", left: 100, width: 880, top: 64, textAlign: "center", fontFamily: ARCHIVO, lineHeight: 0.9, transform: `scale(${sp(f, 4, { damping: 13, stiffness: 170 })})`, textShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 74, color: "#f4efe6" }}>{judul[0]}</div>
          <div style={{ fontSize: 92, color: KUNING }}>{judul[1]}</div>
        </div>}
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - s) * 300}px)`, filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.55))" }}>
          <Boneka nama={nama} h={1920} f={f} fase={label.length} />
        </div>
      </AbsoluteFill>
      <Gelap atas={0.35} bawah={0.7} />
      <Pil teks={label} sub={sub} x={110} y={pilY} f={f} d={8} />
    </AbsoluteFill>
  );
};

// koran realistis (AI) di meja + foto arsip Soekarno-Hatta di bingkai segi delapan
const KoranMeja: React.FC<{ f: number; lama: number }> = ({ f, lama }) => {
  const oct = "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, lama * FPS], [1.0, 1.14])}) rotate(${interpolate(f, [0, lama * FPS], [-1.5, 1])}deg)`, transformOrigin: "55% 50%" }}>
        <Img src={F("t-koran2.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 375, top: 905, width: 456, height: 444, clipPath: oct, transform: `scale(${sp(f, 6)})` }}>
          <Img src={F("duet.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", filter: "grayscale(1) sepia(0.35) contrast(1.1)" }} />
        </div>
        {/* stabilo menyapu judul */}
        <div style={{ position: "absolute", left: 150, top: 680, height: 72, width: k(f, 14, 34, [0, 600]), background: KUNING, mixBlendMode: "multiply", opacity: 0.75, transform: "rotate(-1deg)" }} />
        <div style={{ position: "absolute", left: 110, top: 770, height: 72, width: k(f, 34, 54, [0, 780]), background: KUNING, mixBlendMode: "multiply", opacity: 0.75, transform: "rotate(-1deg)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at ${45 + Math.sin(f / 30) * 6}% 45%, transparent 40%, rgba(0,0,0,0.55))` }} />
    </AbsoluteFill>
  );
};

// debu melayang + kabut + kedip lampu
const Debu: React.FC<{ f: number; n?: number; warna?: string }> = ({ f, n = 40, warna = "255,235,200" }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: n }).map((_, i) => {
      const a = (i * 97) % 1080, b = (i * 211) % 1920, sz = 2 + (i % 4);
      const x = (a + f * (0.3 + (i % 5) * 0.15) + Math.sin(f / 20 + i) * 20) % 1080;
      const y = (b - f * (0.4 + (i % 3) * 0.2) + 1920 * 3) % 1920;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: sz, background: `rgba(${warna},${0.25 + (i % 3) * 0.15})`, filter: "blur(0.6px)" }} />;
    })}
  </AbsoluteFill>
);
const Kabut: React.FC<{ f: number; kuat?: number }> = ({ f, kuat = 0.35 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: kuat, background: `radial-gradient(ellipse 70% 25% at ${30 + Math.sin(f / 60) * 20}% 70%, rgba(230,225,210,0.7), transparent), radial-gradient(ellipse 60% 20% at ${70 + Math.sin(f / 45) * 20}% 55%, rgba(230,225,210,0.5), transparent)` }} />
);
const Kedip: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "rgba(255,170,60,1)", mixBlendMode: "soft-light", opacity: 0.12 + Math.abs(Math.sin(f / 3.1) * Math.sin(f / 7.3)) * 0.18 }} />
);

// kartu tanggal: ruangan tua (lampu templek berkedip) + kalender sobek kertas & jam kayu antik (jarum dibuat sendiri)
const JamDinding: React.FC<{ f: number; jam: number; menit: number }> = ({ f, jam, menit }) => {
  const detik = Math.floor(f / 30) * 6 + Math.min(1, (f % 30) / 3) * 6;
  const jarum = (deg: number, pjg: number, tebal: number, warna: string) => (
    <div style={{ position: "absolute", left: 150 - tebal / 2, top: 150 - pjg, width: tebal, height: pjg + 14, background: warna, borderRadius: tebal, transformOrigin: `${tebal / 2}px ${pjg}px`, transform: `rotate(${deg}deg)`, boxShadow: "3px 5px 4px rgba(0,0,0,0.55)" }} />
  );
  return (
    <div style={{ position: "absolute", left: 560, top: 250, width: 300, height: 300, filter: "drop-shadow(0 20px 26px rgba(0,0,0,0.75))" }}>
      <Img src={F("jam.png")} style={{ position: "absolute", inset: -14, width: 328, height: 328, clipPath: "circle(46% at 50% 50%)", filter: "brightness(0.85) contrast(1.05)" }} />
      <div style={{ position: "absolute", inset: 0, filter: "blur(0.6px)" }}>
        {jarum(jam * 30 + menit / 2, 62, 10, "#1b120a")}
        {jarum(menit * 6 + f * 0.1, 92, 7, "#1b120a")}
        {jarum(detik, 100, 2.5, "#7a1a12")}
        <div style={{ position: "absolute", left: 141, top: 141, width: 18, height: 18, borderRadius: 9, background: "#2a1c10" }} />
      </div>
      <AbsoluteFill style={{ borderRadius: "50%", background: "radial-gradient(circle at 70% 25%, rgba(255,220,160,0.18), transparent 45%)" }} />
    </div>
  );
};
const Lembar: React.FC<{ atas: string; besar: string; bawah?: string; kecil?: boolean }> = ({ atas, besar, bawah, kecil }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg,#efe3c4,#dccb9f 70%,#cdb98a)", boxShadow: "inset 0 0 40px rgba(110,80,30,0.35)", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
    <div style={{ width: "100%", background: "#9b1d14", color: "#f3e6cc", fontFamily: SERIF_TEGAK, fontWeight: 700, fontSize: 40, letterSpacing: 6, textAlign: "center", padding: "12px 0 10px", boxShadow: "0 3px 0 rgba(0,0,0,0.2)" }}>{atas}</div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", fontFamily: SERIF_TEGAK, fontWeight: 900, fontSize: kecil ? 70 : 230, lineHeight: 1, color: "#1f1710", letterSpacing: kecil ? 2 : -6, textShadow: "0 1px 0 rgba(255,255,255,0.3)" }}>{besar}</div>
    {bawah && <div style={{ fontFamily: SERIF_TEGAK, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: bawah === "JUMAT" ? "#9b1d14" : "#3a2a1a", paddingBottom: 26 }}>{bawah}</div>}
    <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(90,60,20,0.04) 0 2px, transparent 2px 5px)", mixBlendMode: "multiply" }} />
  </div>
);
const KartuTanggal: React.FC<{ f: number; atas: string; besar: string; bawah?: string; dari?: [string, string]; jam?: [number, number]; kecil?: boolean }> = ({ f, atas, besar, bawah, dari, jam, kecil }) => {
  const kedip = 0.75 + Math.abs(Math.sin(f / 3.3) * Math.sin(f / 7.9 + 1)) * 0.25;
  const sobek = k(f, 14, 34, [0, 1], Easing.in(Easing.quad));
  return (
    <AbsoluteFill style={{ background: "#0b0805", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${k(f, 0, 110, [1.12, 1.02], Easing.linear)}) translate(${Math.sin(f / 40) * 6}px, ${Math.sin(f / 31) * 4}px)` }}>
        <Img src={F("ruang.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${0.55 + kedip * 0.3}) contrast(1.1)` }} />
        {jam && <JamDinding f={f} jam={jam[0]} menit={jam[1]} />}
        {/* kalender sobek di dinding */}
        <div style={{ position: "absolute", left: jam ? 170 : 300, top: jam ? 600 : 440, width: 440, height: 560, transform: "rotate(-2deg)", filter: `drop-shadow(0 22px 26px rgba(0,0,0,0.7)) brightness(${0.62 + kedip * 0.22}) sepia(0.15)` }}>
          <div style={{ position: "absolute", left: 200, top: -34, width: 40, height: 40, borderRadius: 20, background: "radial-gradient(circle at 35% 35%, #8a7a60, #2a2014)" }} />
          <Lembar atas={atas} besar={besar} bawah={bawah} kecil={kecil} />
          {dari && <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0%", transform: `perspective(900px) rotateX(${sobek * 75}deg) translateY(${sobek * 260}px) rotate(${sobek * 18}deg)`, opacity: 1 - k(f, 26, 36, [0, 1]) }}>
            <Lembar atas={atas} besar={dari[0]} bawah={dari[1]} />
          </div>}
        </div>
        <AbsoluteFill style={{ mixBlendMode: "screen", background: `radial-gradient(circle at 905px 390px, rgba(255,190,90,${0.55 * kedip}) 0, rgba(255,150,60,${0.22 * kedip}) 180px, transparent 520px)` }} />
        <Debu f={f} n={35} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 60% at ${80 + Math.sin(f / 5) * 2}% ${22 + Math.cos(f / 6) * 1.5}%, transparent 35%, rgba(0,0,0,0.75) 100%)` }} />
    </AbsoluteFill>
  );
};

// satu kata 3D di latar grid biru (pola acuan)
const KataGrid: React.FC<{ kata: string; f: number }> = ({ kata, f }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #2c5a9c, #12305f 75%)", overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.22) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.22) 2px, transparent 2px), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
      backgroundSize: "180px 180px, 180px 180px, 36px 36px, 36px 36px", transform: `scale(${k(f, 0, 60, [1.25, 1], Easing.linear)})` }} />
    <div style={{ position: "absolute", top: 860, width: "100%", textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 150, color: "#f4f4f4",
      textShadow: "0 2px 0 #9aa7b8, 0 4px 0 #7d8a9b, 0 6px 0 #5f6b7b, 0 8px 0 #45505e, 0 20px 30px rgba(0,0,0,0.6)", transform: `scale(${sp(f, 2, { damping: 10, stiffness: 150 })}) rotate(${k(f, 0, 50, [-4, 0])}deg)` }}>{kata}</div>
  </AbsoluteFill>
);

// tangan memegang koran rancangan sendiri (bukan surat kabar nyata)
const HEKS = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";
const Koran: React.FC<{ f: number; lama: number }> = ({ f, lama }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, lama * FPS], [1.02, 1.16])}) translate(${Math.sin(f / 23) * 7}px, ${Math.sin(f / 17) * 5}px) rotate(${Math.sin(f / 29) * 0.8}deg)`, transformOrigin: "50% 40%" }}>
      <Img src={F("ai31.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 140, top: 470, width: 800, color: "#2a241b", fontFamily: "Georgia, serif", transform: "rotate(-0.6deg)" }}>
        <div style={{ fontFamily: OSWALD, fontWeight: 700, fontSize: 28, letterSpacing: 5, borderBottom: "3px double #2a241b", paddingBottom: 6 }}>CATATAN SEDJARAH · 15–16 AGUSTUS 1945</div>
        <div style={{ marginTop: 18, fontFamily: ARCHIVO, fontSize: 48, lineHeight: 1.1 }}>
          <span style={{ background: `linear-gradient(${KUNING}, ${KUNING})`, backgroundSize: `${k(f, 20, 45, [0, 100])}% 88%`, backgroundPosition: "0 60%", backgroundRepeat: "no-repeat", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
            Soekarno dan Hatta menolak desakan pemuda
          </span>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
          <div style={{ flex: 1, fontSize: 20, lineHeight: 1.35, opacity: 0.85 }}>
            Usul agar kemerdekaan diumumkan saat itu juga dinilai kurang perhitungan dan bisa memakan banyak korban.
          </div>
          {[{ src: "soekarno.jpg", d: 10, n: "Soekarno" }, { src: "hatta.jpg", d: 16, n: "Hatta" }].map((o, i) => (
            <div key={i} style={{ position: "relative", width: 220, transform: `scale(${sp(f, o.d)})` }}>
              <div style={{ width: 220, height: 260, clipPath: HEKS, background: MERAH, padding: 6 }}>
                <Img src={F(o.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%", clipPath: HEKS, filter: "grayscale(1) contrast(1.1)" }} />
              </div>
              <div style={{ position: "absolute", left: 30, bottom: 20, background: MERAH, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 26, padding: "4px 14px", borderRadius: 8, transform: `scale(${sp(f, o.d + 8)})` }}>{o.n}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// foto disematkan di dinding (pola acuan)
const Sematan: React.FC<{ src: string; x: number; y: number; w: number; rot: number; f: number; d: number; label: string; sub?: string }> = ({ src, x, y, w, rot, f, d, label, sub }) => {
  const s = sp(f, d, { damping: 15, stiffness: 130 });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `translateY(${(1 - s) * -200}px) rotate(${rot}deg)`, opacity: Math.min(1, s * 1.4) }}>
      <div style={{ background: "#efe9dc", padding: 14, paddingBottom: 18, boxShadow: "0 25px 45px rgba(0,0,0,0.75)" }}>
        <Img src={F(src)} style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover", objectPosition: "50% 18%", filter: "grayscale(1) contrast(1.1)" }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: -12, width: 26, height: 26, marginLeft: -13, borderRadius: 13, background: "radial-gradient(circle at 35% 35%, #ff6b5b, #8a120c)", boxShadow: "0 4px 6px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 0, bottom: -44, transform: `rotate(${-rot}deg) scale(${sp(f, d + 10)})`, transformOrigin: "left" }}>
        <div style={{ display: "inline-block", background: MERAH, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 36, padding: "6px 18px", borderRadius: 10, whiteSpace: "nowrap" }}>{label}</div>
        {sub && <div><div style={{ marginTop: 6, display: "inline-block", background: "rgba(10,10,10,0.85)", color: KREM, fontFamily: INTER, fontWeight: 600, fontSize: 24, padding: "4px 12px", borderRadius: 8 }}>{sub}</div></div>}
      </div>
    </div>
  );
};

// intip lubang kunci yang melebar (pola acuan)
const LubangKunci: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => {
  const r = k(f, 10, 60, [1, 6], Easing.in(Easing.quad));
  const m = `radial-gradient(circle at 540px 760px, #000 ${190 * r}px, transparent ${194 * r}px), conic-gradient(from 155deg at 540px ${760 + 120 * r}px, transparent 0deg, #000 1deg, #000 49deg, transparent 50deg)`;
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m, WebkitMaskComposite: "source-over" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- adegan ----------
type Adegan = { t: number; ai?: boolean; isi: (f: number, lama: number) => React.ReactNode };
const SK = "soekarno-pot.png", HT = "hatta-pot.png";

const ADEGAN: Adegan[] = [
  { t: 0, ai: true, isi: (f, l) => {
    const z = interpolate(f, [0, l * FPS], [1.0, 1.08]);
    const masuk = (d: number) => sp(f, d, { damping: 16, stiffness: 110 });
    return (<>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 60%" }}>
        <Img src={F("ai11.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(9px) brightness(0.6)", transform: "scale(1.05)" }} />
        <Debu f={f} n={30} />
        <div style={{ position: "absolute", left: 100, width: 880, top: 170, textAlign: "center", fontFamily: ARCHIVO, lineHeight: 0.92, transform: `scale(${sp(f, s2f(3.1), { damping: 13, stiffness: 170 })})`, textShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 88, color: "#f4efe6" }}>SEHARI SEBELUM</div>
          <div style={{ fontSize: 150, color: MERAH }}>DICULIK</div>
        </div>
        <div style={{ position: "absolute", left: -250, top: 300, transform: `translateX(${(1 - masuk(0)) * -500}px)`, filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.6))" }}><Boneka nama="soekarno" h={1720} f={f} fase={1} /></div>
        <div style={{ position: "absolute", left: 300, top: 330, transform: `translateX(${(1 - masuk(6)) * 500}px)`, filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.6))" }}><Boneka nama="hatta" h={1690} f={f} fase={4} /></div>
      </AbsoluteFill>
      <Gelap atas={0.3} bawah={0.75} />
      <Pil teks="Soekarno" x={110} y={1330} f={f} d={s2f(1.7)} />
      <Pil teks="Mohammad Hatta" x={460} y={1430} f={f} d={s2f(2.3)} />
    </>);
  } },
  { t: 5.9, isi: (f) => <KartuTanggal f={f} atas="1945" besar="AGUSTUS" kecil /> },
  { t: 8.6, ai: true, isi: (f, l) => (<>
      <Kerumunan bg="ai33-bg.jpg" fg="ai33-fg.png" f={f} lama={l} z={[1.02, 1.12]} bokeh={2} /><Kedip f={f} /><Debu f={f} /><Gelap />
      <Judul teks={"JEPANG\nMENYERAH"} y={330} f={f} d={s2f(0.8)} ukuran={110} />
    </>) },
  { t: 11.7, ai: true, isi: (f, l) => (<>
      <AbsoluteFill style={{ transform: `translateY(${k(f, 0, l * FPS, [-90, 40], Easing.inOut(Easing.quad))}px)`, filter: `blur(${k(f, 0, 20, [14, 0])}px)` }}><Kerumunan bg="ai32-bg.jpg" fg="ai32-fg.png" f={f} lama={l} z={[1.18, 1.04]} /></AbsoluteFill><Kabut f={f} kuat={0.3} /><Gelap bawah={0.9} />
    </>) },
  { t: 13.6, ai: true, isi: (f, l) => <AdeganTokoh nama="wikana" label="Wikana" sub="golongan muda" judul={["PEMUDA", "MENDESAK"]} f={f} lama={l} /> },
  { t: 15.4, ai: true, isi: (f, l) => <AdeganTokoh nama="sukarni" label="Sukarni" sub="golongan muda" judul={["MERDEKA", "SEKARANG!"]} f={f} lama={l} /> },
  { t: 16.9, ai: true, isi: (f, l) => <><KoranMeja f={f} lama={l} /><Gelap atas={0.2} bawah={0.6} /></> },
  { t: 20.2, ai: true, isi: (f, l) => <>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, l * FPS], [1.04, 1.1])})` }}><OffthreadVideo src={F("veo-soekarno.mp4")} startFrom={45} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <Gelap atas={0.35} bawah={0.7} />
      <Pil teks="Soekarno" sub="menolak usul pemuda" x={110} y={1330} f={f} d={8} />
    </> },
  { t: 23.5, isi: (f) => <KartuTanggal f={f} atas="AGUSTUS 1945" besar="16" bawah="KAMIS" dari={["15", "RABU"]} jam={[4, 0]} /> },
  { t: 26.9, ai: true, isi: (f, l) => (<>
      <Lapis bg="ai14-bg.jpg" fg="ai14-fg.png" f={f} lama={l} z={[1.0, 1.15]} gerak="melaju" /><Kabut f={f} kuat={0.45} /><Debu f={f} n={25} /><Gelap />
      <Pil teks="Rengasdengklok" sub="Karawang" x={110} y={1330} f={f} d={s2f(1.7)} besar={60} />
    </>) },
  { t: 30.5, ai: true, isi: (f, l) => (<>
      <LubangKunci f={f}><Penuh src="ai21.jpg" lama={l} f={f} z={[1.2, 1.05]} /><Debu f={f} n={30} /></LubangKunci>
      <Pil teks="Rumah Djiaw Kie Siong" sub="warga keturunan Tionghoa" x={110} y={1330} f={f} d={s2f(3.0)} besar={48} />
    </>) },
  { t: 35.3, isi: (f) => <KataGrid kata="didesak" f={f} /> },
  { t: 36.7, ai: true, isi: (f, l) => (<><AdeganTokoh nama="hatta" label="Mohammad Hatta" sub="tetap pada pendirian" judul={["TETAP", "BERTAHAN"]} f={f} lama={l} /></>) },
  { t: 39.5, ai: true, isi: (f, l) => (<>
      <Penuh src="ai34.jpg" lama={l} f={f} z={[1.05, 1.0]} filter="brightness(0.8)" /><Debu f={f} n={35} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d={`M 300 560 Q 540 ${700 + Math.sin(f / 10) * 8} 770 600`} stroke={MERAH} strokeWidth={5} fill="none" strokeDasharray="1200" strokeDashoffset={k(f, s2f(3.0), s2f(3.6), [1200, 0])} />
      </svg>
      <Sematan src="soebardjo.jpg" x={110} y={520} w={360} rot={-4} f={f} d={s2f(1.0)} label="Ahmad Soebardjo" sub="golongan tua" />
      <Sematan src="wikana.jpg" x={590} y={560} w={360} rot={4} f={f} d={s2f(2.9)} label="Wikana" sub="golongan muda" />
      <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", opacity: k(f, 0, 10, [0, 1]) }}>
        <span style={{ fontFamily: OSWALD, fontWeight: 600, fontSize: 70, letterSpacing: 6, color: "#f2f2f2", borderBottom: `7px solid ${MERAH}` }}>JAKARTA</span>
      </div>
    </>) },
  { t: 44.7, ai: true, isi: (f, l) => (<><AdeganTokoh nama="soebardjo" label="Ahmad Soebardjo" sub="jaminan: paling lambat besok siang" f={f} lama={l} judul={["SORE ITU", "MENJEMPUT"]} /></>) },
  { t: 50.7, ai: true, isi: (f, l) => (<>
      <AbsoluteFill style={{ transform: goyang(f, 4) }}><Penuh src="ai11.jpg" lama={l} f={f} z={[1.05, 1.25]} /></AbsoluteFill><Gelap />
      <Judul teks={"MALAM ITU\nKEMBALI KE JAKARTA"} y={330} f={f} d={4} ukuran={74} />
    </>) },
  { t: 54.8, ai: true, isi: (f, l) => <AdeganTokoh nama="maeda" label="Laksamana Maeda" sub="rumahnya tempat merumuskan naskah" judul={["RUMAH", "LAKSAMANA"]} f={f} lama={l} /> },
  { t: 57.3, isi: (f, l) => <><Ketik f={f} lama={l} /><Gelap atas={0.2} bawah={0.7} /></> },
  { t: 59.9, isi: (f) => <KartuTanggal f={f} atas="AGUSTUS 1945" besar="17" bawah="JUMAT" dari={["16", "KAMIS"]} jam={[10, 0]} /> },
  { t: 63.6, isi: (f, l) => (<>
      <Penuh src="proklamasi.jpg" lama={l} f={f} z={[1.3, 1.3]} filter="blur(30px) brightness(0.4)" />
      <AbsoluteFill style={{ transform: `translate(${Math.sin(f / 14) * 4}px, ${Math.cos(f / 17) * 3}px) rotate(${Math.sin(f / 23) * 0.4}deg)` }}>
        <Img src={F("proklamasi.jpg")} style={{ position: "absolute", left: -60, top: 520, width: 1200, transform: `scale(${k(f, 0, l * FPS, [1.0, 1.12], Easing.linear)})`, filter: "sepia(0.3) contrast(1.05)" }} />
      </AbsoluteFill><Gelap />
      <Pil teks="Pukul 10.00" sub="Pegangsaan Timur, Jakarta" x={110} y={1330} f={f} d={4} besar={58} />
      <div style={{ position: "absolute", left: 110, top: 470, fontFamily: INTER, fontSize: 22, color: "rgba(255,255,255,0.75)" }}>foto arsip asli</div>
    </>) },
  { t: 66.4, isi: (f, l) => (<>
      <Penuh src="bendera.jpg" lama={l} f={f} z={[1.3, 1.3]} filter="blur(30px) brightness(0.4)" />
      <Img src={F("bendera.jpg")} style={{ position: "absolute", left: -40, top: 640, width: 1160, transform: `scale(${k(f, 0, l * FPS, [1.0, 1.1], Easing.linear)})`, filter: "sepia(0.35)" }} /><Gelap />
      <div style={{ position: "absolute", left: 110, top: 590, fontFamily: INTER, fontSize: 22, color: "rgba(255,255,255,0.75)" }}>foto arsip asli</div>
      <Judul teks={"INDONESIA\nMERDEKA"} y={330} f={f} d={4} ukuran={128} />
    </>) },
  { t: 68.4, ai: true, isi: (f, l) => (<>
      <Lapis bg="ai24-bg.jpg" fg="ai24-fg.png" f={f} lama={l} z={[1.0, 1.1]} gerak="kibar" />
      <AbsoluteFill style={{ clipPath: "inset(78% 0 0 0)", transform: `scale(${interpolate(f, [0, l * FPS], [1.0, 1.1])})` }}>
        {[0, 1, 2, 3, 4].map((j) => <AbsoluteFill key={j} style={{ clipPath: `inset(0 ${(4 - j) * 20}% 0 ${j * 20}%)`, transform: `translateY(${Math.sin(f / (15 + j * 4) + j) * 4}px) translateX(${Math.sin(f / (25 + j * 3) + j) * 3}px)` }}><Img src={F("ai24.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>)}
      </AbsoluteFill><Debu f={f} n={25} /><Gelap atas={0.6} />
      <Judul teks={"MENUNGGU\natau\nBERGERAK?"} y={300} f={f} d={s2f(2.4)} ukuran={110} />
    </>) },
  { t: 74.3, isi: (f, l) => {
    const kartu = [["t-soekarno.png", -14, -250], ["t-koran2.png", 0, 0], ["ruang.png", 14, 250]] as const;
    return (<>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1d2a2a, #070a0a 75%)" }} />
      <AbsoluteFill style={{ opacity: 0.35, backgroundImage: "linear-gradient(rgba(120,200,190,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(120,200,190,0.18) 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${(f * 0.6) % 60}px)` }} />
      <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", fontFamily: ARCHIVO, fontSize: 230, color: KUNING, letterSpacing: -4, opacity: 0.95, transform: `scale(${sp(f, 6, { damping: 11, stiffness: 160 })})`, textShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>GRATIS</div>
      {kartu.map(([src, rot, dx], i) => (
        <div key={i} style={{ position: "absolute", left: 540 - 170 + dx, top: 520 + Math.abs(dx) * 0.25, width: 340, height: 604, borderRadius: 26, overflow: "hidden", border: "6px solid #111", boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
          transform: `rotate(${rot}deg) translateY(${(1 - sp(f, 14 + i * 5)) * 900}px) translateY(${Math.sin(f / 20 + i) * 8}px)`, zIndex: i === 1 ? 2 : 1 }}>
          <Img src={F(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 100, width: 880, top: 1240, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `scale(${sp(f, 40)})` }}>
        <div style={{ fontFamily: OSWALD, fontWeight: 600, fontSize: 60, letterSpacing: 3, color: "#f6efe2", textAlign: "center", lineHeight: 1.1 }}>TEMPLATE LENGKAP<br /><span style={{ color: KUNING }}>+ SEMUA PROMPT GAMBAR</span></div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: "rgba(239,230,210,0.9)" }}>nggak usah beli</div>
      </div>
      <div style={{ position: "absolute", left: 100, width: 880, top: 1520, display: "flex", justifyContent: "center", transform: `scale(${sp(f, s2f(6.6) - s2f(74.3 - 74.3), { damping: 12, stiffness: 170 })})` }}>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <div style={{ width: 8, background: MERAH }} />
          <div style={{ background: "rgba(10,10,10,0.8)", padding: "14px 26px", fontFamily: OSWALD, fontWeight: 600, fontSize: 46, letterSpacing: 2, color: "#f6efe2" }}>LINK DI BIO · <span style={{ color: KUNING }}>malikisaputra.biz.id/kode</span></div>
        </div>
      </div>
    </>);
  } },
];

const Butir: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.14, mixBlendMode: "overlay", backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 0.7px, transparent 0.8px)", backgroundSize: "3px 3px", transform: `translate(${(f * 7) % 3}px, ${(f * 13) % 3}px)` }} />;
};

const Bungkus: React.FC<{ a: Adegan; lama: number; i: number }> = ({ a, lama, i }) => {
  const f = useCurrentFrame();
  const n = lama * FPS;
  const masuk = k(f, 0, 14, [1, 0], Easing.inOut(Easing.quad)); // 1 → 0
  const keluar = k(f, n - 8, n, [0, 1], Easing.inOut(Easing.quad));
  const arah = i % 2 ? -1 : 1;
  const tf = `scale(${1 + masuk * 0.18 + keluar * 0.12}) rotate(${(masuk * 2 - keluar * 1.5) * arah}deg) translateX(${(masuk * 60 - keluar * 80) * arah}px)`;
  return (
    <AbsoluteFill style={{ background: "#0b0b0b", overflow: "hidden", opacity: Math.min(k(f, 0, 12, [i ? 0.0001 : 1, 1], Easing.inOut(Easing.quad)), k(f, n - 8, n, [1, 0.0001])) }}>
      <AbsoluteFill style={{ transform: tf, filter: `blur(${masuk * 22 + keluar * 18}px) brightness(${1 + keluar * 0.6 + masuk * 0.3})` }}>{a.isi(f, lama)}</AbsoluteFill>
      {/* kilat putih & bocor cahaya saat masuk */}
      <AbsoluteFill style={{ pointerEvents: "none", background: "#fff", opacity: interpolate(f, [0, 5, 12], [0, i ? 0.22 : 0, 0], { extrapolateRight: "clamp" }) }} />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: interpolate(f, [0, 8, 22], [0, i ? 0.8 : 0, 0], { extrapolateRight: "clamp" }),
        background: `radial-gradient(ellipse 60% 45% at ${arah > 0 ? 15 + f * 3 : 85 - f * 3}% 30%, rgba(255,140,40,0.9), rgba(255,60,20,0.35) 45%, transparent 75%)` }} />
      {a.ai && <div style={{ position: "absolute", right: 100, top: 1772, fontFamily: INTER, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.75)", background: "rgba(0,0,0,0.45)", padding: "3px 10px", borderRadius: 6 }}>ilustrasi AI</div>}
    </AbsoluteFill>
  );
};

export const SejarahRengasdengklok: React.FC = () => {
  const mulai = ADEGAN.map((a) => s2f(a.t));
  return (
    <AbsoluteFill style={{ background: "#0b0b0b" }}>
      {ADEGAN.map((a, i) => {
        const dari = mulai[i];
        const sampai = i + 1 < ADEGAN.length ? mulai[i + 1] + 8 : DURASI_RDK;
        return <Sequence key={i} from={dari} durationInFrames={sampai - dari}><Bungkus a={a} lama={(sampai - dari) / FPS} i={i} /></Sequence>;
      })}
      <Butir />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55))" }} />
      <div style={{ position: "absolute", left: 100, width: 620, top: 1770, fontFamily: INTER, fontSize: 22, color: "rgba(239,230,210,0.7)" }}>
        Foto tokoh: arsip publik (Wikimedia Commons), direstorasi · @malikisaputra
      </div>
      {PAKAI_VO && <Audio src={staticFile("vo.wav")} />}
      <Audio src={staticFile(MUSIK)} volume={0.12} loop />
      {mulai.slice(1).map((m, i) => <Sfx key={i} nama="woosh" f={m - 4} vol={0.22} />)}
      <Sfx nama="v-boom" f={s2f(3.2)} vol={0.4} />
      <Sfx nama="v-jam-tik" f={s2f(23.5)} vol={0.3} lama={s2f(3)} />
      <Sfx nama="kamera-shutter" f={s2f(63.6)} vol={0.35} />
    </AbsoluteFill>
  );
};
