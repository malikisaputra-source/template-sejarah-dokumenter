"""Hitung posisi leher (pivot kepala) tiap tokoh dari gambar cutout t-<nama>-pot.png.
Pakai: python3 alat/hitung_sendi.py soekarno hatta ...   → menulis src/boneka-rdk.json
Butuh: pip install pillow numpy"""
import json, sys
import numpy as np
from PIL import Image
out = json.load(open("src/boneka-rdk.json"))
for n in sys.argv[1:]:
    a = np.array(Image.open(f"public/sejarah-rdk/t-{n}-pot.png"))[:, :, 3] > 128
    H, W = a.shape
    rows = np.where(a.any(1))[0]; top, bot = rows[0], rows[-1]; h = bot - top
    lebar = [a[y].sum() for y in range(H)]
    leher = min(range(top + int(h * 0.08), top + int(h * 0.22)), key=lambda y: lebar[y])
    xs = np.where(a[leher])[0]; hx0, hx1 = xs[0], xs[-1]
    xb = np.where(a[top + int(h * 0.3)])[0]; bx0, bx1 = xb[0], xb[-1]; bw = bx1 - bx0
    out[n] = dict(W=W, H=H, leher=leher / H, kx0=(hx0 - (hx1 - hx0) * 0.6) / W, kx1=(hx1 + (hx1 - hx0) * 0.6) / W,
                  bahu=(leher + int(h * 0.04)) / H, tangan=(top + int(h * 0.5)) / H,
                  lx0=bx0 / W, lx1=(bx0 + bw * 0.22) / W, rx0=(bx1 - bw * 0.22) / W, rx1=bx1 / W)
    print(n, round(out[n]["leher"], 3))
json.dump(out, open("src/boneka-rdk.json", "w"), indent=1)
