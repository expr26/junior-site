"""Pictures for the KS2 corner (ages 9 to 11), drawn as inline SVG at build time. Registered into topics.EXTRA_FIGS.

  clock    {"h": 3, "m": 45}                    an analogue clock face showing that time (h 1 to 12, m 0 to 59)
  array    {"rows": 3, "cols": 4}               rows of dots, for times tables (3 rows of 4 = 3 x 4)
  pv       {"n": "4,072", "cols": ["Th","H","T","O"]}   a place value chart; digits fill the columns from the right
           "cols" may also include "t" (tenths) and "h" (hundredths) after "O"; write the number with a point then, like "3.25"
  shape    {"name": "pentagon"}                 a flat shape: triangle, right-triangle, square, rectangle, pentagon, hexagon,
                                                octagon, circle, parallelogram, trapezium, kite, rhombus
  coins    {"items": ["£1", "50p", "20p"]}      UK coins and notes in a row (1p 2p 5p 10p 20p 50p £1 £2 £5 £10 £20)
"""
import html
import math

NAVY, GOLD, GOLD_LT, FUN, SCI, CARD = "var(--navy)", "var(--gold)", "var(--gold-lt)", "var(--fun)", "var(--sci)", "var(--card)"


def _svg(w, h, inner, label):
    return (f'<svg class="fig ks2fig" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{html.escape(label, quote=True)}">'
            f'{inner}</svg>')


def _time_words(h, m):
    if m == 0:
        return f"{h} o'clock"
    if m == 15:
        return f"quarter past {h}"
    if m == 30:
        return f"half past {h}"
    if m == 45:
        return f"quarter to {h % 12 + 1}"
    if m < 30:
        return f"{m} minutes past {h}"
    return f"{60 - m} minutes to {h % 12 + 1}"


def clock(h, m=0, size=170, **_):
    if not (1 <= h <= 12 and 0 <= m <= 59):
        raise TypeError("clock needs h 1 to 12 and m 0 to 59")
    c, r = size / 2, size / 2 - 6
    p = [f'<circle cx="{c}" cy="{c}" r="{r}" fill="{CARD}" stroke="{FUN}" stroke-width="6"/>']
    for i in range(60):
        a = math.radians(i * 6 - 90)
        big = i % 5 == 0
        r0 = r - (13 if big else 7)
        p.append(f'<line x1="{c + r0 * math.cos(a):.1f}" y1="{c + r0 * math.sin(a):.1f}" x2="{c + (r - 3) * math.cos(a):.1f}" '
                 f'y2="{c + (r - 3) * math.sin(a):.1f}" stroke="{NAVY}" stroke-width="{3 if big else 1.2}"/>')
    for n in range(1, 13):
        a = math.radians(n * 30 - 90)
        rr = r - 28
        p.append(f'<text x="{c + rr * math.cos(a):.1f}" y="{c + rr * math.sin(a) + 6:.1f}" text-anchor="middle" font-size="17" '
                 f'font-weight="700" fill="{NAVY}">{n}</text>')
    ha = math.radians((h % 12) * 30 + m * 0.5 - 90)
    ma = math.radians(m * 6 - 90)
    p.append(f'<line x1="{c}" y1="{c}" x2="{c + r * 0.48 * math.cos(ha):.1f}" y2="{c + r * 0.48 * math.sin(ha):.1f}" '
             f'stroke="{NAVY}" stroke-width="8" stroke-linecap="round"/>')
    p.append(f'<line x1="{c}" y1="{c}" x2="{c + r * 0.78 * math.cos(ma):.1f}" y2="{c + r * 0.78 * math.sin(ma):.1f}" '
             f'stroke="{GOLD}" stroke-width="5" stroke-linecap="round"/>')
    p.append(f'<circle cx="{c}" cy="{c}" r="6" fill="{NAVY}"/>')
    return _svg(size, size, "".join(p), f"A clock showing {_time_words(h, m)}. The short hand shows the hour and the long hand the minutes.")


def array(rows, cols, **_):
    gap, r = 28, 10
    w, hgt = cols * gap + 16, rows * gap + 16
    p = [f'<rect x="2" y="2" width="{w - 4}" height="{hgt - 4}" rx="12" fill="var(--fun-bg)"/>']
    for i in range(rows):
        for j in range(cols):
            p.append(f'<circle cx="{8 + gap / 2 + j * gap}" cy="{8 + gap / 2 + i * gap}" r="{r}" fill="{FUN if i % 2 == 0 else SCI}"/>')
    return _svg(w, hgt, "".join(p), f"{rows} rows of {cols} dots")


PV_NAMES = {"M": "millions", "HTh": "hundred thousands", "TTh": "ten thousands", "Th": "thousands", "H": "hundreds", "T": "tens",
            "O": "ones", "t": "tenths", "h": "hundredths"}


def pv(n, cols, **_):
    s = str(n).replace(",", "")
    whole, _, dec = s.partition(".")
    before = [c for c in cols if c not in ("t", "h")]
    after = [c for c in cols if c in ("t", "h")]
    if len(whole) > len(before) or len(dec) > len(after):
        raise TypeError(f"pv: {n} does not fit the columns {cols}")
    digits = [""] * (len(before) - len(whole)) + list(whole) + list(dec) + [""] * (len(after) - len(dec))
    cw, hh = 58, 46
    w = cw * len(cols) + 8 + (10 if after else 0)
    p, x = [], 4
    for k, (col, d) in enumerate(zip(cols, digits)):
        if col == "t":
            p.append(f'<circle cx="{x + 5}" cy="{hh + 30}" r="4" fill="{NAVY}"/>')
            x += 10
        p.append(f'<rect x="{x}" y="4" width="{cw}" height="{hh - 8}" fill="{FUN if col not in ("t", "h") else SCI}" stroke="{CARD}" stroke-width="2"/>')
        p.append(f'<text x="{x + cw / 2}" y="{hh - 14}" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">{html.escape(col)}</text>')
        p.append(f'<rect x="{x}" y="{hh - 4}" width="{cw}" height="{hh + 2}" fill="{CARD}" stroke="var(--line)" stroke-width="2"/>')
        p.append(f'<text x="{x + cw / 2}" y="{hh + 30}" text-anchor="middle" font-size="28" font-weight="700" fill="{NAVY}">{html.escape(d)}</text>')
        x += cw
    label = "Place value chart: " + ", ".join(f"{d or 'nothing'} in the {PV_NAMES.get(c, c)}" for c, d in zip(cols, digits))
    return _svg(w, hh * 2 + 2, "".join(p), label)


def _poly(pts, fill):
    return f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}" fill="{fill}" stroke="{NAVY}" stroke-width="3" stroke-linejoin="round"/>'


def _regular(n, c=80, r=62, rot=-90):
    return [(c + r * math.cos(math.radians(rot + 360 * k / n)), c + r * math.sin(math.radians(rot + 360 * k / n))) for k in range(n)]


SHAPES = {
    "triangle": lambda: _poly(_regular(3, r=66, rot=-90), GOLD_LT),
    "right-triangle": lambda: _poly([(30, 135), (30, 30), (135, 135)], GOLD_LT)
                              + f'<path d="M30 117 h18 v18" fill="none" stroke="{NAVY}" stroke-width="2"/>',
    "square": lambda: _poly([(30, 30), (130, 30), (130, 130), (30, 130)], "var(--fun-bg)"),
    "rectangle": lambda: _poly([(10, 45), (150, 45), (150, 115), (10, 115)], "var(--fun-bg)"),
    "pentagon": lambda: _poly(_regular(5), "var(--sci-bg)"),
    "hexagon": lambda: _poly(_regular(6, rot=0), "var(--sci-bg)"),
    "octagon": lambda: _poly(_regular(8, rot=22.5), "var(--sci-bg)"),
    "circle": lambda: f'<circle cx="80" cy="80" r="62" fill="var(--gold-bg)" stroke="{NAVY}" stroke-width="3"/>',
    "parallelogram": lambda: _poly([(40, 45), (155, 45), (120, 115), (5, 115)], "var(--fun-bg)"),
    "trapezium": lambda: _poly([(45, 45), (115, 45), (150, 115), (10, 115)], "var(--fun-bg)"),
    "kite": lambda: _poly([(80, 10), (125, 60), (80, 150), (35, 60)], GOLD_LT),
    "rhombus": lambda: _poly([(80, 15), (130, 80), (80, 145), (30, 80)], GOLD_LT),
}


def shape(name, **_):
    if name not in SHAPES:
        raise TypeError(f"shape: unknown name {name!r}, use one of {sorted(SHAPES)}")
    return _svg(160, 160, SHAPES[name](), f"A {name.replace('-', '-angled ')}" if name == "right-triangle" else f"A {name}")


COINS = {"1p": (34, "#C9864A"), "2p": (42, "#C9864A"), "5p": (32, "#C8CDD3"), "10p": (44, "#C8CDD3"), "20p": (40, "#C8CDD3"),
         "50p": (50, "#C8CDD3"), "£1": (44, "#E8C25A"), "£2": (52, "#E8C25A")}
NOTES = {"£5": "#5BB4A6", "£10": "#E39A5B", "£20": "#9A7FD1"}


def coins(items, **_):
    p, x, hgt = [], 4, 64
    for it in items:
        if it in COINS:
            d, col = COINS[it]
            cx = x + d / 2
            if it == "50p" or it == "20p":   # seven-sided coins
                pts = [(cx + d / 2 * math.cos(math.radians(-90 + k * 360 / 7)), 32 + d / 2 * math.sin(math.radians(-90 + k * 360 / 7))) for k in range(7)]
                p.append(f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in pts)}" fill="{col}" stroke="#6B6F75" stroke-width="2"/>')
            else:
                p.append(f'<circle cx="{cx}" cy="32" r="{d / 2}" fill="{col}" stroke="#6B6F75" stroke-width="2"/>')
            p.append(f'<text x="{cx}" y="38" text-anchor="middle" font-size="{15 if d > 36 else 13}" font-weight="700" fill="#1E1B3A">{html.escape(it)}</text>')
            x += d + 8
        elif it in NOTES:
            p.append(f'<rect x="{x}" y="8" width="84" height="48" rx="6" fill="{NOTES[it]}" stroke="#4B4F55" stroke-width="2"/>'
                     f'<text x="{x + 42}" y="40" text-anchor="middle" font-size="20" font-weight="700" fill="#1E1B3A">{html.escape(it)}</text>')
            x += 92
        else:
            raise TypeError(f"coins: unknown coin or note {it!r}")
    return _svg(int(x), hgt, "".join(p), "Money: " + ", ".join(items))


FIGS = {"clock": clock, "array": array, "pv": pv, "shape": shape, "coins": coins}
