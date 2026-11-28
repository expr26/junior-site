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


def hundred(shade, **_):
    """A 10 by 10 grid with the first `shade` squares shaded (row by row): hundredths, decimals and percentages."""
    if not 0 <= shade <= 100:
        raise TypeError("hundred needs shade 0 to 100")
    s, p = 14, []
    for i in range(100):
        r, c = divmod(i, 10)
        p.append(f'<rect x="{4 + c * s}" y="{4 + r * s}" width="{s}" height="{s}" fill="{GOLD_LT if i < shade else CARD}" stroke="{NAVY}" stroke-width="1"/>')
    p.append(f'<rect x="4" y="4" width="{10 * s}" height="{10 * s}" fill="none" stroke="{NAVY}" stroke-width="2.5"/>')
    return _svg(10 * s + 8, 10 * s + 8, "".join(p), f"A grid of 100 squares with {shade} shaded")


def ruler(cm=10, mark=None, **_):
    """A ruler from 0 to `cm` centimetres with millimetre marks; an arrow at `mark` (in cm, e.g. 6.4)."""
    u, x0 = 46, 14
    w = cm * u + 2 * x0
    p = [f'<rect x="2" y="10" width="{w - 4}" height="58" rx="6" fill="var(--gold-bg)" stroke="{NAVY}" stroke-width="2"/>']
    for i in range(cm * 10 + 1):
        x = x0 + i * u / 10
        ln = 22 if i % 10 == 0 else 15 if i % 5 == 0 else 9
        p.append(f'<line x1="{x:.1f}" y1="10" x2="{x:.1f}" y2="{10 + ln}" stroke="{NAVY}" stroke-width="{2 if i % 10 == 0 else 1}"/>')
        if i % 10 == 0:
            p.append(f'<text x="{x:.1f}" y="52" text-anchor="middle" font-size="14" font-weight="700" fill="{NAVY}">{i // 10}</text>')
    p.append(f'<text x="{w - 10}" y="62" text-anchor="end" font-size="11" fill="{NAVY}">cm</text>')
    label = f"A ruler from 0 to {cm} centimetres with millimetre marks"
    if mark is not None:
        x = x0 + mark * u
        p.append(f'<path d="M{x:.1f} 8 l-7 -8 h14 z" fill="{FUN}"/>')
        label += ", with an arrow pointing at one of the marks"
    return _svg(w, 72, "".join(p), label)


def jug(level, top=1000, step=100, unit="ml", **_):
    """A measuring jug marked every `step` up to `top`, filled to `level`."""
    h0, h1, x0, wj = 20, 200, 40, 110
    p = [f'<rect x="{x0}" y="{h0}" width="{wj}" height="{h1 - h0}" fill="{CARD}" stroke="{NAVY}" stroke-width="3" rx="8"/>']
    y = h1 - (h1 - h0) * level / top
    p.append(f'<rect x="{x0 + 2}" y="{y:.1f}" width="{wj - 4}" height="{h1 - y - 2:.1f}" fill="var(--sci-bg)" stroke="{SCI}" stroke-width="2"/>')
    for v in range(0, top + 1, step):
        yy = h1 - (h1 - h0) * v / top
        p.append(f'<line x1="{x0}" y1="{yy:.1f}" x2="{x0 + 22}" y2="{yy:.1f}" stroke="{NAVY}" stroke-width="2"/>')
        p.append(f'<text x="{x0 - 6}" y="{yy + 5:.1f}" text-anchor="end" font-size="13" font-weight="700" fill="{NAVY}">{v}</text>')
    p.append(f'<text x="{x0 + wj + 8}" y="{h0 + 12}" font-size="13" fill="{NAVY}">{html.escape(unit)}</text>')
    return _svg(x0 + wj + 40, h1 + 10, "".join(p), f"A measuring jug marked up to {top} {unit}, with water in it")


FIGS.update({"hundred": hundred, "ruler": ruler, "jug": jug})


# ---------- statistics (KS2 "Graphs and data") ----------
def _axis(p, x0, y0, w, h, top, step, unit):
    for v in range(0, top + 1, step):
        y = y0 - h * v / top
        p.append(f'<line x1="{x0}" y1="{y:.1f}" x2="{x0 + w}" y2="{y:.1f}" stroke="var(--line, #ccc)" stroke-width="1"/>')
        p.append(f'<text x="{x0 - 6}" y="{y + 4:.1f}" text-anchor="end" font-size="12" fill="{NAVY}">{v}</text>')
    p.append(f'<line x1="{x0}" y1="{y0 - h}" x2="{x0}" y2="{y0}" stroke="{NAVY}" stroke-width="2"/>')
    p.append(f'<line x1="{x0}" y1="{y0}" x2="{x0 + w}" y2="{y0}" stroke="{NAVY}" stroke-width="2"/>')
    if unit:
        p.append(f'<text x="4" y="{y0 - h - 8}" font-size="11" fill="{NAVY}">{html.escape(unit)}</text>')


def barchart(bars, top, step, unit="", **_):
    """A bar chart: bars [["Cats", 6], ...], y axis 0..top marked every step, unit shown above the axis."""
    x0, y0, h = 34, 190, 160
    bw = min(46, int(250 / len(bars)))
    w = bw * len(bars) + 10
    p = []
    _axis(p, x0, y0, w, h, top, step, unit)
    for i, (lab, v) in enumerate(bars):
        x = x0 + 8 + i * bw
        y = y0 - h * v / top
        p.append(f'<rect x="{x}" y="{y:.1f}" width="{bw - 10}" height="{y0 - y:.1f}" fill="{GOLD_LT}" stroke="{GOLD}" stroke-width="2"/>')
        p.append(f'<text x="{x + (bw - 10) / 2:.1f}" y="{y0 + 16}" text-anchor="middle" font-size="12" font-weight="700" fill="{NAVY}">{html.escape(lab)}</text>')
    return _svg(x0 + w + 6, y0 + 24, "".join(p), "A bar chart: " + ", ".join(f"{l}" for l, _ in bars) + ". Read each bar against the scale.")


def linegraph(points, top, step, unit="", **_):
    """A line graph: points [["9am", 12], ...], y axis 0..top marked every step."""
    x0, y0, h = 34, 190, 160
    gap = min(52, int(260 / max(1, len(points) - 1)))
    w = gap * (len(points) - 1) + 20
    p = []
    _axis(p, x0, y0, w, h, top, step, unit)
    pts = [(x0 + 10 + i * gap, y0 - h * v / top) for i, (_, v) in enumerate(points)]
    p.append('<polyline points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + f'" fill="none" stroke="{FUN}" stroke-width="3"/>')
    for (x, y), (lab, _) in zip(pts, points):
        p.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4.5" fill="{FUN}"/>')
        p.append(f'<text x="{x:.1f}" y="{y0 + 16}" text-anchor="middle" font-size="11" font-weight="700" fill="{NAVY}">{html.escape(lab)}</text>')
    return _svg(x0 + w + 8, y0 + 24, "".join(p), "A line graph across " + ", ".join(l for l, _ in points) + ". Read each point against the scale.")


def picto(rows, key, item, **_):
    """A pictogram: rows [["Mon", 3], ["Tue", 2.5]] counted in symbols (halves allowed); one symbol = `key` items."""
    s, lw = 24, 50
    most = max(math.ceil(n) for _, n in rows)
    w = lw + most * (s + 4) + 8
    p = []
    for r, (lab, n) in enumerate(rows):
        y = 8 + r * (s + 8)
        p.append(f'<text x="4" y="{y + s * 0.7:.1f}" font-size="13" font-weight="700" fill="{NAVY}">{html.escape(lab)}</text>')
        full, half = int(n), n - int(n) >= 0.5
        for k in range(full + (1 if half else 0)):
            cx, cy = lw + k * (s + 4) + s / 2, y + s / 2
            if k < full:
                p.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{s / 2 - 1}" fill="{GOLD_LT}" stroke="{GOLD}" stroke-width="2"/>')
            else:
                r0 = s / 2 - 1
                p.append(f'<path d="M{cx:.1f} {cy - r0:.1f} A{r0} {r0} 0 0 0 {cx:.1f} {cy + r0:.1f} Z" fill="{GOLD_LT}" stroke="{GOLD}" stroke-width="2"/>')
    yk = 8 + len(rows) * (s + 8) + 6
    p.append(f'<circle cx="{lw - 30 + s / 2}" cy="{yk + s / 2}" r="{s / 2 - 1}" fill="{GOLD_LT}" stroke="{GOLD}" stroke-width="2"/>')
    p.append(f'<text x="{lw - 30 + s + 8}" y="{yk + s * 0.7:.1f}" font-size="13" fill="{NAVY}">= {key} {html.escape(item)}</text>')
    return _svg(max(w, 200), yk + s + 8, "".join(p), f"A pictogram. Each circle stands for {key} {item}; a half circle stands for half that many.")


def table(head, rows, **_):
    """A simple data table: head ["Pet", "Children"], rows [["Dog", "8"], ...]."""
    cw = [max(len(str(r[c])) for r in [head] + rows) * 9 + 24 for c in range(len(head))]
    rh, p, y = 28, [], 2
    for i, r in enumerate([head] + rows):
        x = 2
        for c, cell in enumerate(r):
            fill = "var(--gold-bg)" if i == 0 else CARD
            p.append(f'<rect x="{x}" y="{y}" width="{cw[c]}" height="{rh}" fill="{fill}" stroke="{NAVY}" stroke-width="1.5"/>')
            p.append(f'<text x="{x + cw[c] / 2}" y="{y + 19}" text-anchor="middle" font-size="13" font-weight="{700 if i == 0 else 400}" fill="{NAVY}">{html.escape(str(cell))}</text>')
            x += cw[c]
        y += rh
    return _svg(sum(cw) + 4, y + 2, "".join(p), "A table: " + "; ".join(", ".join(map(str, r)) for r in [head] + rows))


FIGS.update({"colchart": barchart, "linegraph": linegraph, "picto": picto, "table": table})
