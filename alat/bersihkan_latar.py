"""Hapus orang/benda depan dari gambar latar supaya saat lapisan depan digerakkan tidak muncul bayangan ganda.
Pakai: python3 alat/bersihkan_latar.py public/sejarah-rdk/ai24.jpg public/sejarah-rdk/ai24-fg.png  → ai24-bg.jpg
Butuh: pip install pillow"""
import sys
from PIL import Image, ImageFilter
src, fg = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB"); m = Image.open(fg).resize(im.size).split()[3]
m = m.point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(12))
Image.composite(im.filter(ImageFilter.GaussianBlur(60)), im, m).save(src.rsplit(".", 1)[0] + "-bg.jpg", quality=92)
