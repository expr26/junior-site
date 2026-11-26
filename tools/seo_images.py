"""
Make the icon and social-share PNGs from the owl SVGs (run by hand, not by build.py).

    python3 tools/seo_images.py

Needs Playwright with Chromium (a dev machine only; Cloudflare never runs this).
Writes favicon.ico (repo root, served at /favicon.ico) and into static/:
  favicon-32.png, apple-touch-icon.png (180), icon-192.png, icon-512.png, icon-maskable-512.png
  img/og-default.png (1200 x 630, the picture shown when a page is shared or linked)
"""
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent.parent
STATIC = HERE / "static"
FAVICON = (STATIC / "favicon.svg").read_text(encoding="utf-8")
MASCOT = (HERE / "partials" / "mascot.svg").read_text(encoding="utf-8")
FONTS = STATIC / "fonts"


def font(name):
    import base64
    return "data:font/woff2;base64," + base64.b64encode((FONTS / name).read_bytes()).decode()


def icon_html(size, pad, bg):
    inner = size - 2 * pad
    svg = FAVICON.replace("<svg ", f'<svg width="{inner}" height="{inner}" ', 1)
    radius = "0" if bg == "transparent" else "22%"
    return (f'<html><body style="margin:0;background:transparent">'
            f'<div style="width:{size}px;height:{size}px;display:grid;place-items:center;background:{bg};border-radius:{radius}">'
            f'{svg}</div></body></html>')


def og_html():
    mascot = MASCOT.replace('width="96" height="96"', 'width="360" height="360"')
    return f"""<html><head><style>
@font-face{{font-family:Fredoka;font-weight:700;src:url({font("fredoka-latin-700-normal.woff2")})}}
@font-face{{font-family:Plex;font-weight:600;src:url({font("ibm-plex-sans-latin-600-normal.woff2")})}}
body{{margin:0}}
.c{{width:1200px;height:630px;position:relative;overflow:hidden;background:#FFF9F0;font-family:Plex;color:#1E1B3A}}
.b{{position:absolute;border-radius:50%}}
h1{{font:700 88px/1.05 Fredoka;margin:0;color:#2D1B69}}
h1 span{{color:#6C4DF6}}
p{{font-size:38px;line-height:1.3;margin:28px 0 0}}
.t{{position:absolute;left:80px;top:130px;width:700px}}
.chips{{margin-top:36px;display:flex;gap:14px}}
.chips b{{font:700 30px Fredoka;padding:10px 24px;border-radius:999px;background:#6C4DF6;color:#fff}}
.chips b:nth-child(2){{background:#0F9488}} .chips b:nth-child(3){{background:#FF5D8F}}
.m{{position:absolute;right:60px;top:120px}}
.url{{position:absolute;left:80px;bottom:44px;font-size:28px;color:#55526E}}
</style></head><body><div class="c">
<div class="b" style="width:520px;height:520px;right:-60px;top:-80px;background:#DCD3FF"></div>
<div class="b" style="width:300px;height:300px;left:-90px;bottom:-120px;background:#FFD8C2"></div>
<div class="b" style="width:220px;height:220px;right:330px;bottom:-110px;background:#C9F2EA"></div>
<div class="b" style="width:120px;height:120px;left:560px;top:30px;background:#FFEFB0"></div>
<div class="t"><h1>ExaminerPrep <span>Junior</span></h1>
<p>Maths and Science games, lessons and practice for ages 9 to 14</p>
<div class="chips"><b>KS2</b><b>KS3</b><b>IB PYP</b></div></div>
<div class="m">{mascot}</div>
<div class="url">junior.examinerprep.com · free · no ads</div>
</div></body></html>"""


def shot(page, markup, w, h, out, transparent=True):
    page.set_viewport_size({"width": w, "height": h})
    page.set_content(markup)
    page.wait_for_timeout(300)
    page.screenshot(path=str(out), omit_background=transparent, clip={"x": 0, "y": 0, "width": w, "height": h})
    print("wrote", out.relative_to(HERE))


def main():
    with sync_playwright() as p:
        try:
            b = p.chromium.launch()
        except Exception:   # a Chromium installed outside Playwright
            b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = b.new_page(device_scale_factor=1)
        shot(page, icon_html(32, 0, "transparent"), 32, 32, STATIC / "favicon-32.png")
        shot(page, icon_html(180, 18, "#FFF4D6"), 180, 180, STATIC / "apple-touch-icon.png", transparent=False)
        shot(page, icon_html(192, 8, "transparent"), 192, 192, STATIC / "icon-192.png")
        shot(page, icon_html(512, 20, "transparent"), 512, 512, STATIC / "icon-512.png")
        # maskable: the owl sits inside the 80% safe zone on a full square
        page.set_viewport_size({"width": 512, "height": 512})
        shot(page, icon_html(512, 90, "#FFF4D6").replace("border-radius:22%", "border-radius:0"), 512, 512,
             STATIC / "icon-maskable-512.png", transparent=False)
        shot(page, icon_html(48, 0, "transparent"), 48, 48, HERE / "favicon-48.tmp.png")
        png = (HERE / "favicon-48.tmp.png").read_bytes()
        (HERE / "favicon-48.tmp.png").unlink()
        # favicon.ico holding one 48 x 48 PNG (allowed since Windows Vista; what Google asks for)
        import struct
        ico = struct.pack("<HHH", 0, 1, 1) + struct.pack("<BBBBHHII", 48, 48, 0, 0, 1, 32, len(png), 22) + png
        (HERE / "favicon.ico").write_bytes(ico)
        print("wrote favicon.ico")
        shot(page, og_html(), 1200, 630, STATIC / "img" / "og-default.png", transparent=False)
        b.close()


if __name__ == "__main__":
    main()
