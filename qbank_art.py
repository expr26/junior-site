"""Pictures for the question bank, drawn as inline SVG at build time (no image files, nothing from other sites).

art(key)   the big picture for a subject or topic page ("art" in qbank/subjects.json and qbank/<subject>/<topic>.json)
New question figures, registered into topics.EXTRA_FIGS so they work in "fig" everywhere:
  hundred  {"shade": 25}                         a 10 by 10 grid with the first `shade` squares coloured (percentages)
  spring   {"load": "2 N", "stretch": 2}         a spring hanging from a bar, unstretched and then with a weight (stretch 0 to 4)
"""
import html
import math

import topics

P, P2, TEAL, ORANGE, SUN, PINK, BLUE, INK, CREAM = ("#6C4DF6", "#4A33C9", "#0F9488", "#FF8A3D", "#FFC93C", "#FF5D8F",
                                                    "#3B82F6", "#2D1B69", "#FFF4D6")


def _svg(inner, label, w=240, h=200):
    return (f'<svg class="qb-art" viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(label, quote=True)}">'
            f'<circle cx="{w / 2}" cy="{h / 2 + 4}" r="{min(w, h) / 2 - 6}" fill="var(--fun-bg)"/>{inner}</svg>')


def _sparkles(*pts):
    return "".join(f'<path d="M{x} {y - s} L{x + s * .3} {y - s * .3} L{x + s} {y} L{x + s * .3} {y + s * .3} L{x} {y + s} '
                   f'L{x - s * .3} {y + s * .3} L{x - s} {y} L{x - s * .3} {y - s * .3} Z" fill="{c}"/>' for x, y, s, c in pts)


def art_maths():
    return _svg(
        # pie with a slice out
        f'<circle cx="82" cy="86" r="42" fill="{SUN}" stroke="{INK}" stroke-width="4"/>'
        f'<path d="M82 86 L82 44 A42 42 0 0 1 124 86 Z" fill="{ORANGE}" stroke="{INK}" stroke-width="4" stroke-linejoin="round" transform="translate(8 -8)"/>'
        f'<path d="M82 86 L52 56 M82 86 L52 116 M82 86 L82 128" stroke="{INK}" stroke-width="3"/>'
        # triangle ruler
        f'<path d="M128 160 L196 160 L128 92 Z" fill="{TEAL}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
        f'<path d="M142 146 L168 146 L142 120 Z" fill="var(--fun-bg)" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
        + "".join(f'<path d="M{128 + 10 * i} 160 v-7" stroke="{INK}" stroke-width="2.5"/>' for i in range(1, 7))
        # dice
        + f'<g transform="rotate(-12 64 160)"><rect x="40" y="136" width="48" height="48" rx="10" fill="{PINK}" stroke="{INK}" stroke-width="4"/>'
        + "".join(f'<circle cx="{x}" cy="{y}" r="4.5" fill="#fff"/>' for x, y in ((52, 148), (64, 160), (76, 172)))
        + "</g>"
        # symbols
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700">'
          f'<circle cx="172" cy="56" r="24" fill="{P}"/><text x="172" y="67" text-anchor="middle" font-size="32" fill="#fff">π</text>'
          f'<text x="138" y="40" font-size="30" fill="{BLUE}">+</text><text x="200" y="104" font-size="30" fill="{ORANGE}">×</text>'
          f'<text x="20" y="54" font-size="28" fill="{TEAL}">÷</text></g>'
        + _sparkles((214, 36, 7, SUN), (28, 110, 6, P), (112, 186, 5, TEAL)),
        "Maths pictures: a pie cut into slices, a set square, a dice and maths symbols")


def art_physics():
    return _svg(
        # planet with a ring: back of the ring, planet, front of the ring
        f'<ellipse cx="88" cy="84" rx="66" ry="16" fill="none" stroke="#C99A1E" stroke-width="7" transform="rotate(-16 88 84)"/>'
        f'<circle cx="88" cy="84" r="40" fill="{P}" stroke="{INK}" stroke-width="4"/>'
        f'<path d="M58 70 q20 8 50 -4 M60 96 q24 6 54 -6" stroke="#8F78FF" stroke-width="6" fill="none" stroke-linecap="round"/>'
        f'<path d="M22 84 A66 16 0 0 0 154 84" fill="none" stroke="{SUN}" stroke-width="7" stroke-linecap="round" transform="rotate(-16 88 84)"/>'
        # lightning bolt
        f'<path d="M184 30 L158 86 H180 L166 136 L206 70 H184 L198 30 Z" fill="{SUN}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
        # magnet
        f'<g transform="rotate(20 76 160)"><path d="M48 132 v28 a28 28 0 0 0 56 0 v-28 h-18 v28 a10 10 0 0 1 -20 0 v-28 Z" fill="#E5484D" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
        f'<rect x="48" y="126" width="18" height="14" fill="#C9D1DE" stroke="{INK}" stroke-width="4"/><rect x="86" y="126" width="18" height="14" fill="#C9D1DE" stroke="{INK}" stroke-width="4"/></g>'
        # atom
        f'<g transform="translate(168 164)" fill="none" stroke="{TEAL}" stroke-width="4"><ellipse rx="30" ry="11"/>'
        f'<ellipse rx="30" ry="11" transform="rotate(60)"/><ellipse rx="30" ry="11" transform="rotate(-60)"/></g>'
        f'<circle cx="168" cy="164" r="7" fill="{PINK}" stroke="{INK}" stroke-width="3"/>'
        + _sparkles((26, 40, 7, SUN), (214, 120, 6, P), (130, 188, 5, ORANGE), (130, 22, 5, TEAL)),
        "Physics pictures: a planet with rings, a lightning bolt, a magnet and an atom")


def art_fdp():
    slices = []
    for i in range(8):
        if i == 1:
            continue
        a0, a1 = i * 45 - 90, (i + 1) * 45 - 90
        slices.append(f'<path d="M0 0 L{_c(a0)} A56 56 0 0 1 {_c(a1)} Z" fill="{SUN}" stroke="#B9792F" stroke-width="3" stroke-linejoin="round"/>')
    peps = "".join(f'<circle cx="{x}" cy="{y}" r="6" fill="#E5484D"/>' for x, y in ((-24, -26), (-34, 8), (-12, 30), (18, 30), (34, 6), (-8, -6), (12, 12)))
    leaves = "".join(f'<ellipse cx="{x}" cy="{y}" rx="5" ry="3" fill="#2E8B57" transform="rotate({r} {x} {y})"/>' for x, y, r in ((-20, 18, 30), (24, -4, -20), (2, -30, 60)))
    return _svg(
        f'<g transform="translate(96 104)"><circle r="62" fill="#D99A4E"/>{"".join(slices)}{peps}{leaves}</g>'
        # the slice that has been taken out
        f'<g transform="translate(150 50) rotate(10)"><path d="M0 0 L{_c(-45)} A56 56 0 0 1 {_c(0)} Z" fill="{SUN}" stroke="#B9792F" stroke-width="3" stroke-linejoin="round"/>'
        f'<circle cx="26" cy="-14" r="5" fill="#E5484D"/></g>'
        f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700">'
        f'<g transform="rotate(-8 196 132)"><rect x="166" y="112" width="62" height="40" rx="12" fill="{P}"/><text x="197" y="141" text-anchor="middle" font-size="24" fill="#fff">⅛</text></g>'
        f'<g transform="rotate(6 186 178)"><rect x="152" y="160" width="70" height="36" rx="12" fill="{TEAL}"/><text x="187" y="186" text-anchor="middle" font-size="22" fill="#fff">12.5%</text></g>'
        f'<g transform="rotate(-6 44 40)"><rect x="12" y="22" width="64" height="36" rx="12" fill="{ORANGE}"/><text x="44" y="48" text-anchor="middle" font-size="22" fill="#fff">0.125</text></g></g>'
        + _sparkles((214, 30, 7, SUN), (24, 150, 6, P)),
        "A pizza cut into 8 slices with one slice taken out: one eighth, 0.125 or 12.5%")


def _c(deg, r=56):
    import math
    a = math.radians(deg)
    return f"{r * math.cos(a):.1f} {r * math.sin(a):.1f}"


def art_forces():
    return _svg(
        # ground
        f'<path d="M14 160 H226" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        + "".join(f'<path d="M{x} 162 l-8 10" stroke="{INK}" stroke-width="2.5" stroke-linecap="round"/>' for x in range(40, 226, 22))
        # child pushing
        + f'<g stroke="{INK}" stroke-width="7" stroke-linecap="round" fill="none"><path d="M56 104 L74 120 L60 158 M74 120 L96 156"/>'
          f'<path d="M58 108 L92 104 M62 116 L94 116" stroke="{P}" stroke-width="7"/></g>'
          f'<path d="M50 90 L76 124" stroke="{P}" stroke-width="18" stroke-linecap="round"/>'
          f'<circle cx="46" cy="76" r="15" fill="#F4C7A1" stroke="{INK}" stroke-width="3"/>'
          f'<path d="M32 72 q12 -18 30 -4" fill="{ORANGE}" stroke="{INK}" stroke-width="3"/><circle cx="52" cy="76" r="2.4" fill="{INK}"/>'
        # crate
        + f'<rect x="96" y="96" width="64" height="64" rx="6" fill="{SUN}" stroke="{INK}" stroke-width="4"/>'
          f'<path d="M96 96 L160 160 M160 96 L96 160" stroke="#B9792F" stroke-width="4"/>'
        # arrows: push and friction
        + f'<path d="M104 74 H150" stroke="{P}" stroke-width="7" stroke-linecap="round"/><path d="M148 64 L166 74 L148 84 Z" fill="{P}"/>'
          f'<path d="M210 150 H178" stroke="{PINK}" stroke-width="6" stroke-linecap="round"/><path d="M180 141 L166 150 L180 159 Z" fill="{PINK}"/>'
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="17"><text x="114" y="60" fill="{P}">push</text>'
          f'<text x="176" y="138" fill="{PINK}">friction</text></g>'
        # apple and gravity
        + f'<circle cx="198" cy="56" r="15" fill="#E5484D" stroke="{INK}" stroke-width="3"/><path d="M198 41 q2 -8 8 -10" stroke="{INK}" stroke-width="3" fill="none"/>'
          f'<ellipse cx="206" cy="38" rx="7" ry="3.5" fill="#2E8B57" transform="rotate(-30 206 38)"/>'
          f'<path d="M198 76 V104" stroke="{TEAL}" stroke-width="6" stroke-linecap="round"/><path d="M189 102 L198 118 L207 102 Z" fill="{TEAL}"/>'
        + _sparkles((26, 40, 7, SUN), (118, 30, 5, TEAL)),
        "A child pushes a crate while friction pulls back on it, and gravity pulls an apple down")


ART = {"maths": art_maths, "physics": art_physics, "fdp": art_fdp, "forces": art_forces}


def art(key, where):
    if key not in ART:
        raise topics.ContentError(f"{where}: unknown art {key!r} (one of {sorted(ART)})")
    return ART[key]()


# ---------- question figures ----------
def fig_hundred(shade=0, **_):
    shade = int(shade)
    s, g = 22, 2
    cells = []
    for k in range(100):
        r, c = divmod(k, 10)
        cells.append(f'<rect x="{4 + c * (s + g)}" y="{4 + r * (s + g)}" width="{s}" height="{s}" rx="3" '
                     f'fill="{"var(--fun)" if k < shade else "var(--card)"}" stroke="var(--fun)" stroke-width="1.5"/>')
    w = 8 + 10 * (s + g) - g
    return (f'<svg class="fig" viewBox="0 0 {w} {w}" width="{w}" height="{w}" role="img" '
            f'aria-label="A grid of 100 squares with {shade} coloured">{"".join(cells)}</svg>')


def fig_spring(load="1 N", stretch=2, **_):
    stretch = max(0, min(4, float(stretch)))

    def coil(x, top, length):
        turns, w = 8, 16
        pts = [f"{x} {top}", f"{x} {top + 8}"]
        step = (length - 16) / (turns * 2)
        for i in range(turns * 2):
            pts.append(f"{x + (w if i % 2 == 0 else -w)} {top + 8 + step * (i + .5):.1f}")
        pts.append(f"{x} {top + length - 8}")
        pts.append(f"{x} {top + length}")
        return f'<polyline points="{" ".join(pts)}" fill="none" stroke="var(--navy)" stroke-width="3" stroke-linejoin="round"/>'

    base, extra = 90, stretch * 18
    parts = ['<rect x="10" y="10" width="260" height="12" rx="4" fill="#8A94A6"/>',
             coil(80, 22, base), coil(200, 22, base + extra),
             f'<path d="M184 {22 + base + extra} h32 l6 34 h-44 Z" fill="var(--fun)"/>',
             f'<text x="200" y="{22 + base + extra + 26}" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">{html.escape(str(load))}</text>',
             f'<text x="80" y="{22 + base + 26}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--muted)">no weight</text>']
    if extra:
        y0, y1 = 22 + base, 22 + base + extra
        parts.append(f'<path d="M120 {y0} H236 M236 {y0} V{y1} M228 {y1} H244" stroke="var(--gold)" stroke-width="2.5" stroke-dasharray="5 4"/>')
        parts.append(f'<text x="246" y="{(y0 + y1) / 2 + 5}" font-size="14" font-weight="700" fill="var(--gold)">stretch</text>')
    h = 22 + base + 4 * 18 + 46
    return (f'<svg class="fig" viewBox="0 0 300 {h}" width="300" height="{h}" role="img" '
            f'aria-label="Two identical springs hanging from a bar. The second has a {html.escape(str(load))} weight on it and is longer">{"".join(parts)}</svg>')


topics.EXTRA_FIGS.update({"hundred": fig_hundred, "spring": fig_spring})


# ---------- batch 2: place value, negative numbers, factors, speed ----------
def art_place_value():
    flat = "".join(f'<path d="M{24 + 6 * i} 70 V130 M24 {70 + 6 * i} H84" stroke="#B9792F" stroke-width="1.4"/>' for i in range(1, 10))
    rods = "".join(f'<rect x="{104 + 14 * k}" y="70" width="10" height="60" rx="2" fill="{TEAL}" stroke="{INK}" stroke-width="2.5"/>'
                   + "".join(f'<path d="M{104 + 14 * k} {70 + 6 * i} h10" stroke="{INK}" stroke-width="1.2"/>' for i in range(1, 10)) for k in range(3))
    ones = "".join(f'<rect x="{x}" y="{y}" width="12" height="12" rx="2" fill="{PINK}" stroke="{INK}" stroke-width="2.5"/>'
                   for x, y in ((168, 118), (184, 118), (200, 118), (176, 102), (192, 102)))
    lab = "".join(f'<circle cx="{x}" cy="160" r="15" fill="{c}"/><text x="{x}" y="167" text-anchor="middle" font-size="18" fill="#fff">{t}</text>'
                  for x, c, t in ((54, ORANGE, "H"), (124, TEAL, "T"), (190, PINK, "O")))
    return _svg(
        f'<rect x="24" y="70" width="60" height="60" rx="3" fill="{SUN}" stroke="{INK}" stroke-width="3"/>{flat}{rods}{ones}'
        f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700">{lab}'
        f'<g transform="rotate(-6 120 36)"><rect x="70" y="16" width="100" height="40" rx="14" fill="{P}"/>'
        f'<text x="120" y="44" text-anchor="middle" font-size="24" fill="#fff">135</text></g>'
        f'<text x="186" y="44" font-size="26" fill="{ORANGE}">≈</text></g>'
        + _sparkles((30, 40, 7, SUN), (214, 80, 6, TEAL)),
        "Place value blocks: 1 hundred square, 3 tens rods and 5 ones cubes make 135")


def art_negative():
    ticks = "".join(f'<path d="M{40 + 26 * i} 150 v12" stroke="{INK}" stroke-width="3"/>'
                    f'<text x="{40 + 26 * i}" y="184" text-anchor="middle" font-size="16" font-weight="700" fill="{BLUE if i < 3 else INK if i == 3 else ORANGE}">{i - 3 if i != 3 else 0}</text>'
                    for i in range(7))
    return _svg(
        # thermometer
        f'<rect x="40" y="22" width="22" height="98" rx="11" fill="#fff" stroke="{INK}" stroke-width="3"/>'
        f'<rect x="46" y="78" width="10" height="44" fill="{BLUE}"/><circle cx="51" cy="124" r="16" fill="{BLUE}" stroke="{INK}" stroke-width="3"/>'
        + "".join(f'<path d="M62 {34 + 12 * i} h8" stroke="{INK}" stroke-width="2"/>' for i in range(7))
        # snowflake and sun
        + f'<g stroke="{BLUE}" stroke-width="4" stroke-linecap="round"><path d="M110 40 v36 M94 49 l32 18 M94 67 l32 -18"/></g>'
          f'<circle cx="188" cy="54" r="18" fill="{SUN}" stroke="{INK}" stroke-width="3"/>'
        + "".join(f'<path d="M{188 + 26 * __import__("math").cos(a / 4 * 3.1416)} {54 + 26 * __import__("math").sin(a / 4 * 3.1416)} l{6 * __import__("math").cos(a / 4 * 3.1416):.1f} {6 * __import__("math").sin(a / 4 * 3.1416):.1f}" stroke="{ORANGE}" stroke-width="4" stroke-linecap="round"/>' for a in range(8))
        # number line and a hop
        + f'<path d="M24 156 H216" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>{ticks}'
          f'<path d="M66 146 q26 -40 52 0" fill="none" stroke="{P}" stroke-width="4" stroke-dasharray="6 5"/>'
          f'<path d="M112 140 l8 8 l2 -11" fill="none" stroke="{P}" stroke-width="4" stroke-linecap="round"/>'
          f'<g transform="translate(66 132)"><ellipse rx="13" ry="10" fill="#3BB273" stroke="{INK}" stroke-width="2.5"/>'
          f'<circle cx="-6" cy="-9" r="5" fill="#fff" stroke="{INK}" stroke-width="2"/><circle cx="6" cy="-9" r="5" fill="#fff" stroke="{INK}" stroke-width="2"/>'
          f'<circle cx="-6" cy="-9" r="2" fill="{INK}"/><circle cx="6" cy="-9" r="2" fill="{INK}"/></g>',
        "A thermometer below zero, a snowflake, the sun and a frog hopping along a number line from minus 3 to 3")


def art_factors():
    def node(x, y, t, c, r=17):
        return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" stroke="{INK}" stroke-width="3"/>'
                f'<text x="{x}" y="{y + 7}" text-anchor="middle" font-size="19" fill="#fff">{t}</text>')
    lines = "".join(f'<path d="M{a} {b} L{c} {d}" stroke="{INK}" stroke-width="3"/>' for a, b, c, d in
                    ((120, 40, 84, 84), (120, 40, 156, 84), (84, 84, 60, 132), (84, 84, 104, 132), (156, 84, 140, 132), (156, 84, 182, 132)))
    return _svg(
        f'{lines}<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700">'
        + node(120, 40, "24", P, 20) + node(84, 84, "4", TEAL) + node(156, 84, "6", TEAL)
        + node(60, 132, "2", ORANGE) + node(104, 132, "2", ORANGE) + node(140, 132, "2", ORANGE) + node(182, 132, "3", PINK)
        + f'<g transform="rotate(-5 120 176)"><rect x="62" y="158" width="116" height="34" rx="12" fill="{SUN}" stroke="{INK}" stroke-width="2.5"/>'
          f'<text x="120" y="182" text-anchor="middle" font-size="19" fill="{INK}">2³ × 3 = 24</text></g></g>'
        + _sparkles((30, 60, 7, SUN), (212, 40, 6, P)),
        "A factor tree: 24 splits into 4 and 6, then into the primes 2, 2, 2 and 3")


def art_speed():
    return _svg(
        # road
        f'<rect x="10" y="132" width="220" height="30" rx="6" fill="#5B6475"/>'
        + "".join(f'<rect x="{20 + 40 * i}" y="145" width="22" height="4" rx="2" fill="#fff"/>' for i in range(6))
        # car
        + f'<g transform="translate(118 118)"><rect x="-46" y="-12" width="96" height="28" rx="10" fill="{PINK}" stroke="{INK}" stroke-width="3"/>'
          f'<path d="M-26 -12 L-12 -32 H18 L32 -12 Z" fill="{PINK}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
          f'<path d="M-10 -14 L-4 -26 H14 L22 -14 Z" fill="#CFE8FF"/><circle cx="-24" cy="18" r="10" fill="{INK}"/><circle cx="28" cy="18" r="10" fill="{INK}"/>'
          f'<circle cx="-24" cy="18" r="4" fill="#C9D1DE"/><circle cx="28" cy="18" r="4" fill="#C9D1DE"/></g>'
          f'<g stroke="{P}" stroke-width="4" stroke-linecap="round"><path d="M30 100 h26 M20 114 h30 M34 128 h18"/></g>'
        # stopwatch
        + f'<circle cx="62" cy="54" r="26" fill="#fff" stroke="{INK}" stroke-width="4"/><rect x="56" y="20" width="12" height="8" rx="2" fill="{INK}"/>'
          f'<path d="M62 54 L62 36 M62 54 L74 60" stroke="{ORANGE}" stroke-width="4" stroke-linecap="round"/>'
        # small graph
        + f'<g transform="translate(140 22)"><rect width="80" height="64" rx="8" fill="#fff" stroke="{INK}" stroke-width="3"/>'
          f'<path d="M12 54 V10 M12 54 H72" stroke="{INK}" stroke-width="2.5"/><path d="M12 54 L34 34 L48 34 L68 12" fill="none" stroke="{TEAL}" stroke-width="4" stroke-linejoin="round"/></g>'
        + _sparkles((26, 170, 6, SUN), (222, 110, 6, SUN)),
        "A car speeding along a road, a stopwatch and a distance-time graph")


ART.update({"place-value": art_place_value, "negative": art_negative, "factors": art_factors, "speed": art_speed})


def fig_dtgraph(points, tmax, dmax, tstep, dstep, tlabel="Time (s)", dlabel="Distance (m)", **_):
    """Distance-time graph. points: [[t, d], ...] joined by straight lines."""
    W, H, L, B, R, T = 320, 230, 52, 186, 304, 14
    sx, sy = (R - L) / tmax, (B - T) / dmax
    g = []
    t = 0
    while t <= tmax + 1e-9:
        x = L + t * sx
        g.append(f'<path d="M{x:.1f} {T} V{B}" stroke="var(--line)" stroke-width="1.5"/>'
                 f'<text x="{x:.1f}" y="{B + 18}" text-anchor="middle" font-size="13" fill="var(--ink)">{t:g}</text>')
        t += tstep
    d = 0
    while d <= dmax + 1e-9:
        y = B - d * sy
        g.append(f'<path d="M{L} {y:.1f} H{R}" stroke="var(--line)" stroke-width="1.5"/>'
                 f'<text x="{L - 6}" y="{y + 4:.1f}" text-anchor="end" font-size="13" fill="var(--ink)">{d:g}</text>')
        d += dstep
    pts = " ".join(f"{L + a * sx:.1f},{B - b * sy:.1f}" for a, b in points)
    g.append(f'<path d="M{L} {T} V{B} H{R}" fill="none" stroke="var(--navy)" stroke-width="2.5"/>')
    g.append(f'<polyline points="{pts}" fill="none" stroke="var(--fun)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>')
    g.append(f'<text x="{(L + R) / 2}" y="{H - 4}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--navy)">{html.escape(tlabel)}</text>')
    g.append(f'<text x="14" y="{(T + B) / 2}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--navy)" transform="rotate(-90 14 {(T + B) / 2})">{html.escape(dlabel)}</text>')
    desc = "; ".join(f"at {a:g} the distance is {b:g}" for a, b in points)
    return (f'<svg class="fig" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
            f'aria-label="Distance-time graph: {html.escape(desc, quote=True)}">{"".join(g)}</svg>')


def fig_thermo(temp, lo=-10, hi=10, step=2, **_):
    """A thermometer with a scale from lo to hi showing temp (°C)."""
    T, B, x = 16, 196, 70
    sy = (B - T) / (hi - lo)
    y = B - (temp - lo) * sy
    g = [f'<rect x="{x - 10}" y="{T - 8}" width="20" height="{B - T + 20}" rx="10" fill="var(--card)" stroke="var(--navy)" stroke-width="3"/>',
         f'<rect x="{x - 5}" y="{y:.1f}" width="10" height="{B + 14 - y:.1f}" fill="#E5484D"/>',
         f'<circle cx="{x}" cy="{B + 22}" r="16" fill="#E5484D" stroke="var(--navy)" stroke-width="3"/>']
    v = lo
    while v <= hi:
        yy = B - (v - lo) * sy
        g.append(f'<path d="M{x + 10} {yy:.1f} h10" stroke="var(--navy)" stroke-width="2"/>'
                 f'<text x="{x + 26}" y="{yy + 5:.1f}" font-size="14" font-weight="{700 if v == 0 else 400}" fill="var(--ink)">{str(v).replace("-", "−")}</text>')
        v += step
    return (f'<svg class="fig" viewBox="0 0 140 {B + 44}" width="140" height="{B + 44}" role="img" '
            f'aria-label="A thermometer with a scale from {lo} to {hi} degrees Celsius">{"".join(g)}</svg>')


topics.EXTRA_FIGS.update({"dtgraph": fig_dtgraph, "thermo": fig_thermo})


# ---------- batch 3: algebra, equations, sequences, energy, power ----------
def _tile(x, y, t, c, rot=0, w=44):
    return (f'<g transform="rotate({rot} {x + w / 2} {y + w / 2})"><rect x="{x}" y="{y}" width="{w}" height="{w}" rx="10" fill="{c}" stroke="{INK}" stroke-width="3"/>'
            f'<text x="{x + w / 2}" y="{y + w / 2 + 9}" text-anchor="middle" font-size="26" font-style="italic" font-family="Georgia,serif" font-weight="700" fill="#fff">{t}</text></g>')


def art_algebra():
    return _svg(
        _tile(30, 40, "x", P, -10) + _tile(84, 30, "y", TEAL, 6) + _tile(150, 46, "n", ORANGE, -4)
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700">'
          f'<rect x="28" y="110" width="184" height="52" rx="16" fill="#fff" stroke="{INK}" stroke-width="3"/>'
          f'<text x="120" y="145" text-anchor="middle" font-size="24" fill="{INK}"><tspan font-family="Georgia,serif" font-style="italic">3x</tspan> + 2 = 14</text>'
          f'<circle cx="198" cy="168" r="18" fill="{SUN}" stroke="{INK}" stroke-width="3"/><text x="198" y="176" text-anchor="middle" font-size="22" fill="{INK}">?</text></g>'
        + _sparkles((210, 30, 7, SUN), (24, 176, 6, PINK)),
        "Algebra letter tiles x, y and n, and the equation 3x + 2 = 14")


def art_equations():
    return _svg(
        f'<path d="M120 52 V170" stroke="{INK}" stroke-width="6"/><path d="M92 172 H148" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>'
        f'<path d="M34 64 H206" stroke="{INK}" stroke-width="7" stroke-linecap="round"/><circle cx="120" cy="56" r="9" fill="{SUN}" stroke="{INK}" stroke-width="3"/>'
        f'<path d="M48 64 L30 112 M48 64 L66 112 M192 64 L174 112 M192 64 L210 112" stroke="#8A94A6" stroke-width="2.5"/>'
        f'<path d="M22 112 H74 a26 12 0 0 1 -52 0 Z" fill="#C9D1DE" stroke="{INK}" stroke-width="3"/>'
        f'<path d="M166 112 H218 a26 12 0 0 1 -52 0 Z" fill="#C9D1DE" stroke="{INK}" stroke-width="3"/>'
        + _tile(26, 78, "x", P, 0, 30) + f'<circle cx="64" cy="100" r="10" fill="{ORANGE}" stroke="{INK}" stroke-width="2.5"/>'
        + "".join(f'<circle cx="{x}" cy="{y}" r="10" fill="{ORANGE}" stroke="{INK}" stroke-width="2.5"/>' for x, y in ((178, 100), (198, 100), (188, 84), (208, 84), (168, 84)))
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700"><rect x="70" y="12" width="100" height="30" rx="12" fill="{TEAL}"/>'
          f'<text x="120" y="33" text-anchor="middle" font-size="18" fill="#fff"><tspan font-family="Georgia,serif" font-style="italic">x</tspan> + 1 = 5</text></g>'
        + _sparkles((212, 150, 6, SUN), (28, 150, 6, P)),
        "A balance scale with x and 1 counter on one side and 5 counters on the other: x + 1 = 5")


def art_sequences():
    steps = "".join(f'<rect x="{24 + 40 * i}" y="{150 - 26 * i}" width="40" height="{26 * i + 26}" fill="{c}" stroke="{INK}" stroke-width="3"/>'
                    f'<text x="{44 + 40 * i}" y="{170 - 26 * i}" text-anchor="middle" font-size="18" fill="#fff">{v}</text>'
                    for i, (v, c) in enumerate(((3, P), (7, TEAL), (11, ORANGE), (15, PINK), (19, BLUE))))
    hops = "".join(f'<path d="M{44 + 40 * i} {140 - 26 * i} q20 -26 40 -26" fill="none" stroke="{INK}" stroke-width="2.5" stroke-dasharray="4 4"/>'
                   f'<text x="{68 + 40 * i}" y="{122 - 26 * i}" font-size="14" fill="{INK}">+4</text>' for i in range(4))
    return _svg(f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700">{steps}{hops}</g>'
                + _sparkles((212, 32, 7, SUN), (30, 60, 6, TEAL)),
                "A staircase of numbers 3, 7, 11, 15, 19 going up by 4 each step")


def art_energy():
    return _svg(
        # battery
        f'<rect x="30" y="58" width="44" height="80" rx="8" fill="#fff" stroke="{INK}" stroke-width="4"/><rect x="42" y="50" width="20" height="10" rx="2" fill="{INK}"/>'
        f'<rect x="36" y="96" width="32" height="36" rx="4" fill="#3BB273"/><rect x="36" y="78" width="32" height="14" rx="4" fill="#3BB273"/>'
        # sun
        f'<circle cx="182" cy="52" r="22" fill="{SUN}" stroke="{INK}" stroke-width="3"/>'
        + "".join(f'<path d="M{182 + 30 * math.cos(a * math.pi / 4):.1f} {52 + 30 * math.sin(a * math.pi / 4):.1f} l{7 * math.cos(a * math.pi / 4):.1f} {7 * math.sin(a * math.pi / 4):.1f}" stroke="{ORANGE}" stroke-width="4" stroke-linecap="round"/>' for a in range(8))
        # flame
        + f'<path d="M120 170 c-26 0 -34 -26 -18 -46 c4 12 10 14 12 8 c-4 -18 8 -34 20 -40 c-4 16 22 26 18 52 c-2 16 -14 26 -32 26 Z" fill="{ORANGE}" stroke="{INK}" stroke-width="3"/>'
          f'<path d="M120 166 c-10 0 -14 -10 -8 -20 c4 6 8 4 8 -2 c8 6 12 22 0 22 Z" fill="{SUN}"/>'
        # spring
        + f'<polyline points="186,112 200,118 172,126 200,134 172,142 200,150 172,158 186,164" fill="none" stroke="{TEAL}" stroke-width="5" stroke-linejoin="round"/>'
        # arrows between them
        + f'<path d="M80 98 q20 -40 60 -44" fill="none" stroke="{P}" stroke-width="4" stroke-dasharray="6 5"/>'
        + _sparkles((26, 170, 6, P), (214, 186, 5, SUN)),
        "Energy stores: a battery (chemical), the Sun, a flame (thermal) and a squashed spring (elastic)")


def art_power():
    return _svg(
        f'<path d="M96 40 a40 40 0 0 1 48 0 a40 40 0 0 1 8 62 c-8 8 -10 14 -10 24 h-44 c0 -10 -2 -16 -10 -24 a40 40 0 0 1 8 -62 Z" fill="{SUN}" stroke="{INK}" stroke-width="4"/>'
        f'<path d="M108 112 l6 -30 l6 12 l6 -12 l6 30" fill="none" stroke="{ORANGE}" stroke-width="3"/>'
        f'<rect x="98" y="128" width="44" height="12" rx="3" fill="#C9D1DE" stroke="{INK}" stroke-width="3"/><rect x="100" y="142" width="40" height="12" rx="3" fill="#C9D1DE" stroke="{INK}" stroke-width="3"/>'
        f'<path d="M112 156 h16 l-4 8 h-8 Z" fill="{INK}"/>'
        + "".join(f'<path d="M{120 + 58 * math.cos(a)} {78 + 58 * math.sin(a)} l{10 * math.cos(a):.1f} {10 * math.sin(a):.1f}" stroke="{SUN}" stroke-width="5" stroke-linecap="round"/>'
                  for a in (math.pi * k / 6 for k in (7, 8, 9, 10, 11)))
        # meter
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700"><g transform="rotate(-6 54 150)"><rect x="18" y="128" width="74" height="44" rx="10" fill="{INK}"/>'
          f'<text x="55" y="157" text-anchor="middle" font-size="17" fill="#7CFFB2">0352</text><text x="55" y="186" text-anchor="middle" font-size="13" fill="{INK}">kWh</text></g>'
          f'<g transform="rotate(8 190 150)"><rect x="160" y="126" width="62" height="48" rx="10" fill="{TEAL}"/><text x="191" y="157" text-anchor="middle" font-size="22" fill="#fff">£</text></g></g>'
        + _sparkles((30, 40, 7, P), (212, 40, 6, PINK)),
        "A glowing light bulb, an electricity meter in kilowatt-hours and a pound sign")


ART.update({"algebra": art_algebra, "equations": art_equations, "sequences": art_sequences, "energy": art_energy, "power": art_power})


def fig_pattern(counts, colour="fun", **_):
    """A growing pattern: picture k has counts[k] squares in an L shape (a row and a column)."""
    s, gap = 16, 20
    parts, x0 = [], 4
    H = 6 + s * max((c + 1) // 2 + 1 for c in counts) + 26
    for k, c in enumerate(counts):
        row = (c + 1) // 2
        col = c - row
        slot = max(row * s, 72)
        left = x0 + (slot - row * s) / 2
        cells = [(i, 0) for i in range(row)] + [(0, j + 1) for j in range(col)]
        for i, j in cells:
            parts.append(f'<rect x="{left + i * s}" y="{H - 30 - j * s - s}" width="{s - 2}" height="{s - 2}" rx="3" fill="var(--{colour})"/>')
        parts.append(f'<text x="{x0 + slot / 2}" y="{H - 8}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">Pattern {k + 1}</text>')
        x0 += slot + gap
    x0 -= gap - 4
    return (f'<svg class="fig" viewBox="0 0 {x0} {H}" width="{x0}" height="{H}" role="img" '
            f'aria-label="A growing pattern of squares: {", ".join(str(c) for c in counts)} squares">{"".join(parts)}</svg>')


def fig_sankey(total, useful, wasted, unit="J", **_):
    """Energy transfer diagram. useful/wasted: [label, amount]; the arrow widths are in proportion."""
    W, H = 400, 200
    k = 90 / total
    wu, ww = useful[1] * k, wasted[1] * k
    y0 = 40
    parts = [f'<path d="M10 {y0} H170 Q{170 + ww + 10} {y0 + wu} {170 + ww + 10} {y0 + wu + 70} H{180 - 2} V{y0 + wu}" fill="none"/>',
             f'<rect x="10" y="{y0}" width="170" height="{wu + ww}" fill="var(--fun)"/>',
             f'<path d="M180 {y0} H290 V{y0 - 10} L318 {y0 + wu / 2} L290 {y0 + wu + 10} V{y0 + wu} H180 Z" fill="var(--fun)"/>',
             f'<path d="M180 {y0 + wu} H{180 + ww} V{H - 40} H{180 + ww + 10} L{180 + ww / 2} {H - 14} L{170} {H - 40} H180 Z" fill="var(--gold-lt)"/>',
             f'<text x="20" y="{y0 + (wu + ww) / 2 + 6}" font-size="16" font-weight="700" fill="#fff">{total} {unit} in</text>',
             f'<text x="300" y="{y0 - 18}" text-anchor="end" font-size="15" font-weight="700" fill="var(--ink)">{html.escape(useful[0])}: {useful[1]} {unit}</text>',
             f'<text x="{190 + ww + 6}" y="{H - 50}" font-size="15" font-weight="700" fill="var(--ink)">{html.escape(wasted[0])}</text>',
             f'<text x="{190 + ww + 6}" y="{H - 32}" font-size="15" font-weight="700" fill="var(--ink)">{wasted[1]} {unit}</text>']
    return (f'<svg class="fig" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Energy diagram: {total} {unit} in, '
            f'{html.escape(useful[0])} {useful[1]} {unit}, {html.escape(wasted[0])} {wasted[1]} {unit}">{"".join(parts[1:])}</svg>')


topics.EXTRA_FIGS.update({"pattern": fig_pattern, "sankey": fig_sankey})


# ---------- batch 4: coordinates, ratio, angles, sound, light ----------
def art_coordinates():
    grid = "".join(f'<path d="M{40 + 20 * i} 30 V170 M40 {30 + 20 * i} H200" stroke="#C9D1DE" stroke-width="1.5"/>' for i in range(8) if 30 + 20 * i <= 170 or True)
    return _svg(
        f'<rect x="40" y="30" width="160" height="140" fill="#fff" stroke="{INK}" stroke-width="3" rx="4"/>{grid}'
        f'<path d="M40 170 H206 M40 170 V24" stroke="{INK}" stroke-width="3.5"/>'
        f'<path d="M40 150 L200 50" stroke="{P}" stroke-width="5" stroke-linecap="round"/>'
        + "".join(f'<circle cx="{x}" cy="{y}" r="8" fill="{c}" stroke="{INK}" stroke-width="2.5"/>' for x, y, c in ((80, 125, ORANGE), (120, 100, TEAL), (160, 75, PINK)))
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700"><rect x="132" y="112" width="70" height="30" rx="10" fill="{SUN}" stroke="{INK}" stroke-width="2.5"/>'
          f'<text x="167" y="133" text-anchor="middle" font-size="17" fill="{INK}">(4, 3)</text>'
          f'<text x="210" y="176" font-size="16" fill="{INK}">x</text><text x="30" y="24" font-size="16" fill="{INK}">y</text></g>'
        + _sparkles((24, 60, 6, P), (220, 40, 7, SUN)),
        "A coordinate grid with three points on a straight line")


def art_ratio():
    return _svg(
        # glass with two layers 2:3
        f'<path d="M70 40 L84 176 H156 L170 40 Z" fill="#fff" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
        f'<path d="M77 108 L84 172 H156 L163 108 Z" fill="{ORANGE}"/><path d="M73 70 L77 108 H163 L167 70 Z" fill="#CFE8FF"/>'
        f'<path d="M150 20 L132 120" stroke="{PINK}" stroke-width="7" stroke-linecap="round"/>'
        f'<circle cx="106" cy="140" r="6" fill="#fff" opacity=".6"/><circle cx="128" cy="150" r="4" fill="#fff" opacity=".6"/>'
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700"><g transform="rotate(-8 40 100)"><rect x="10" y="84" width="58" height="34" rx="12" fill="{P}"/>'
          f'<text x="39" y="108" text-anchor="middle" font-size="21" fill="#fff">2 : 3</text></g>'
          f'<g transform="rotate(6 200 140)"><circle cx="200" cy="140" r="24" fill="{TEAL}"/><text x="200" y="147" text-anchor="middle" font-size="18" fill="#fff">⅖</text></g></g>'
        + _sparkles((204, 50, 7, SUN), (36, 160, 6, TEAL)),
        "A glass of squash: 2 parts orange to 3 parts water")


def art_angles():
    import math as m
    return _svg(
        f'<path d="M28 160 A92 92 0 0 1 212 160 Z" fill="{SUN}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
        f'<path d="M58 160 A62 62 0 0 1 182 160" fill="none" stroke="{INK}" stroke-width="2"/>'
        + "".join(f'<path d="M{120 + 92 * m.cos(m.radians(a)):.1f} {160 - 92 * m.sin(m.radians(a)):.1f} L{120 + (80 if a % 30 else 72) * m.cos(m.radians(a)):.1f} {160 - (80 if a % 30 else 72) * m.sin(m.radians(a)):.1f}" stroke="{INK}" stroke-width="2"/>' for a in range(10, 180, 10))
        + f'<circle cx="120" cy="160" r="6" fill="{INK}"/>'
        f'<path d="M120 160 L{120 + 104 * m.cos(m.radians(50)):.1f} {160 - 104 * m.sin(m.radians(50)):.1f}" stroke="{P}" stroke-width="6" stroke-linecap="round"/>'
        f'<path d="M120 160 L226 160" stroke="{P}" stroke-width="6" stroke-linecap="round"/>'
        f'<path d="M150 160 A30 30 0 0 0 {120 + 30 * m.cos(m.radians(50)):.1f} {160 - 30 * m.sin(m.radians(50)):.1f}" fill="none" stroke="{PINK}" stroke-width="5"/>'
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700"><rect x="150" y="104" width="56" height="30" rx="10" fill="{PINK}"/>'
          f'<text x="178" y="125" text-anchor="middle" font-size="18" fill="#fff">50°</text></g>'
        + f'<path d="M30 40 L74 40 L52 76 Z" fill="{TEAL}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
        + _sparkles((210, 40, 7, SUN), (100, 30, 5, ORANGE)),
        "A protractor measuring a 50 degree angle, and a triangle")


def art_sound():
    return _svg(
        # speaker
        f'<rect x="26" y="78" width="30" height="46" rx="4" fill="{P}" stroke="{INK}" stroke-width="3"/>'
        f'<path d="M56 80 L92 52 V150 L56 122 Z" fill="{P2}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
        + "".join(f'<path d="M{108 + 22 * i} {72 - 8 * i} q{14 + 4 * i} {29 + 8 * i} 0 {58 + 16 * i}" fill="none" stroke="{TEAL}" stroke-width="5" stroke-linecap="round" opacity="{1 - .2 * i}"/>' for i in range(3))
        # notes
        + f'<g fill="{PINK}"><ellipse cx="190" cy="66" rx="10" ry="7" transform="rotate(-20 190 66)"/><path d="M198 62 V28 l16 6 v8 l-12 -4" stroke="{PINK}" stroke-width="3"/></g>'
          f'<g fill="{ORANGE}"><ellipse cx="200" cy="150" rx="9" ry="6.5" transform="rotate(-20 200 150)"/><path d="M207 146 V118" stroke="{ORANGE}" stroke-width="3"/></g>'
        + _sparkles((40, 40, 7, SUN), (60, 172, 6, P)),
        "A loudspeaker sending out sound waves, with musical notes")


def art_light():
    return _svg(
        # prism and rainbow
        f'<path d="M120 46 L170 140 H70 Z" fill="#E8F4FF" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
        f'<path d="M18 112 L100 92" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M18 112 L100 92" stroke="{SUN}" stroke-width="3" stroke-linecap="round"/>'
        + "".join(f'<path d="M140 98 L224 {112 + 10 * i}" stroke="{c}" stroke-width="6" stroke-linecap="round"/>'
                  for i, c in enumerate(("#E5484D", ORANGE, SUN, "#3BB273", BLUE, "#4F46E5", "#9333EA")))
        + f'<path d="M100 92 L140 98" stroke="#fff" stroke-width="6" opacity=".9"/>'
        # sun
        + f'<circle cx="40" cy="44" r="16" fill="{SUN}" stroke="{INK}" stroke-width="3"/>'
        + "".join(f'<path d="M{40 + 22 * math.cos(a * math.pi / 4):.1f} {44 + 22 * math.sin(a * math.pi / 4):.1f} l{5 * math.cos(a * math.pi / 4):.1f} {5 * math.sin(a * math.pi / 4):.1f}" stroke="{ORANGE}" stroke-width="3.5" stroke-linecap="round"/>' for a in range(8))
        + _sparkles((206, 40, 7, P), (60, 170, 6, TEAL)),
        "White light going into a glass prism and splitting into a rainbow of colours")


ART.update({"coordinates": art_coordinates, "ratio": art_ratio, "angles": art_angles, "sound": art_sound, "light": art_light})


def fig_grid(points=(), lo=-1, hi=6, line=None, ylo=None, yhi=None, polys=(), mirror=None, **_):
    """Coordinate grid from lo to hi (x) and ylo to yhi (y). points: [[x, y, "A"], ...]; line: [[x1, y1], [x2, y2]]."""
    ylo = lo if ylo is None else ylo
    yhi = hi if yhi is None else yhi
    s, pad = 30, 28
    W, H = (hi - lo) * s + 2 * pad, (yhi - ylo) * s + 2 * pad
    X = lambda x: pad + (x - lo) * s
    Y = lambda y: H - pad - (y - ylo) * s
    g = []
    for x in range(lo, hi + 1):
        g.append(f'<path d="M{X(x)} {Y(ylo)} V{Y(yhi)}" stroke="var(--line)" stroke-width="1.5"/>')
        if x:
            g.append(f'<text x="{X(x)}" y="{Y(0) + 17}" text-anchor="middle" font-size="13" fill="var(--ink)">{str(x).replace("-", "−")}</text>')
    for y in range(ylo, yhi + 1):
        g.append(f'<path d="M{X(lo)} {Y(y)} H{X(hi)}" stroke="var(--line)" stroke-width="1.5"/>')
        if y:
            g.append(f'<text x="{X(0) - 7}" y="{Y(y) + 5}" text-anchor="end" font-size="13" fill="var(--ink)">{str(y).replace("-", "−")}</text>')
    g.append(f'<text x="{X(0) - 7}" y="{Y(0) + 17}" text-anchor="end" font-size="13" fill="var(--ink)">0</text>')
    g.append(f'<path d="M{X(lo)} {Y(0)} H{X(hi) + 10} M{X(0)} {Y(ylo)} V{Y(yhi) - 10}" stroke="var(--navy)" stroke-width="2.5"/>')
    g.append(f'<text x="{X(hi) + 12}" y="{Y(0) + 5}" font-size="15" font-style="italic" font-family="Georgia,serif" fill="var(--navy)">x</text>'
             f'<text x="{X(0) + 6}" y="{Y(yhi) - 10}" font-size="15" font-style="italic" font-family="Georgia,serif" fill="var(--navy)">y</text>')
    for k, (pts, lab) in enumerate(polys):
        d = " ".join(f"{X(x)},{Y(y)}" for x, y in pts)
        col = ("var(--fun)", "var(--pink)", "var(--sci)")[k % 3]
        g.append(f'<polygon points="{d}" fill="{col}" fill-opacity=".35" stroke="{col}" stroke-width="3" stroke-linejoin="round"/>')
        cx, cy = sum(x for x, _ in pts) / len(pts), sum(y for _, y in pts) / len(pts)
        g.append(f'<text x="{X(cx)}" y="{Y(cy) + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="var(--navy)">{html.escape(lab)}</text>')
    if mirror:
        (a, b), (c, d) = mirror
        g.append(f'<path d="M{X(a)} {Y(b)} L{X(c)} {Y(d)}" stroke="var(--gold)" stroke-width="3" stroke-dasharray="8 6"/>')
    if line:
        (a, b), (c, d) = line
        g.append(f'<path d="M{X(a)} {Y(b)} L{X(c)} {Y(d)}" stroke="var(--fun)" stroke-width="4" stroke-linecap="round"/>')
    for p in points:
        x, y, lab = p
        g.append(f'<circle cx="{X(x)}" cy="{Y(y)}" r="6" fill="var(--pink)" stroke="var(--navy)" stroke-width="2"/>'
                 f'<text x="{X(x) + 9}" y="{Y(y) - 8}" font-size="16" font-weight="700" fill="var(--navy)" paint-order="stroke" stroke="var(--card)" stroke-width="4">{html.escape(lab)}</text>')
    return (f'<svg class="fig" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
            f'aria-label="A coordinate grid{(' with points ' + html.escape(', '.join(p[2] for p in points))) if points else ''}{(' with shapes ' + html.escape(', '.join(p[1] for p in polys))) if polys else ''}">{"".join(g)}</svg>')


def fig_angles(kind, a=None, b=None, labels=(), **_):
    """kind 'line': a straight line with a ray making angle a (labels[0]) and the rest (labels[1]).
       kind 'triangle': angles a and b at the base (labels[0], labels[1]) and labels[2] at the top.
       kind 'point': angles round a point; a = list of angles, labels = their labels."""
    R = math.radians
    if kind == "line":
        W, H, cx, cy = 300, 150, 150, 120
        ex, ey = cx + 120 * math.cos(R(180 - a)), cy - 120 * math.sin(R(180 - a))
        g = [f'<path d="M20 {cy} H280" stroke="var(--navy)" stroke-width="4" stroke-linecap="round"/>',
             f'<path d="M{cx} {cy} L{ex:.1f} {ey:.1f}" stroke="var(--navy)" stroke-width="4" stroke-linecap="round"/>',
             _arc(cx, cy, 34, 180 - a, 180, "var(--pink)"), _arc(cx, cy, 26, 0, 180 - a, "var(--fun)")]
        g.append(_alab(cx, cy, 56, 180 - a / 2, labels[0]))
        g.append(_alab(cx, cy, 50, (180 - a) / 2, labels[1]))
        desc = f"A straight line with angles {labels[0]} and {labels[1]} next to each other"
    elif kind == "triangle":
        W, H = 300, 200
        A, B = (30, 175), (270, 175)
        t = (B[0] - A[0]) * math.tan(R(b)) / (math.tan(R(a)) + math.tan(R(b)))
        C = (A[0] + t, A[1] - t * math.tan(R(a)))
        g = [f'<path d="M{A[0]} {A[1]} L{B[0]} {B[1]} L{C[0]:.1f} {C[1]:.1f} Z" fill="var(--fun-bg)" stroke="var(--navy)" stroke-width="4" stroke-linejoin="round"/>',
             _arc(A[0], A[1], 30, 0, a, "var(--pink)"), _arc(B[0], B[1], 30, 180 - b, 180, "var(--pink)"),
             _alab(A[0], A[1], 52, a / 2, labels[0]), _alab(B[0], B[1], 52, 180 - b / 2, labels[1]),
             f'<text x="{C[0]:.1f}" y="{C[1] + 34:.1f}" text-anchor="middle" font-size="17" font-weight="700" fill="var(--navy)">{html.escape(labels[2])}</text>']
        desc = f"A triangle with angles {labels[0]}, {labels[1]} and {labels[2]}"
    else:
        W, H, cx, cy = 240, 220, 120, 110
        g, start = [], 90
        for k, ang in enumerate(a):
            g.append(f'<path d="M{cx} {cy} L{cx + 95 * math.cos(R(start)):.1f} {cy - 95 * math.sin(R(start)):.1f}" stroke="var(--navy)" stroke-width="4" stroke-linecap="round"/>')
            g.append(_arc(cx, cy, 24 + 6 * (k % 2), start, start + ang, ("var(--pink)", "var(--fun)", "var(--sci)", "var(--gold)")[k % 4]))
            g.append(_alab(cx, cy, 58, start + ang / 2, labels[k]))
            start += ang
        desc = "Angles round a point: " + ", ".join(labels)
    return (f'<svg class="fig" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{html.escape(desc, quote=True)}">{"".join(g)}</svg>')


def _arc(cx, cy, r, a0, a1, col):
    R = math.radians
    x0, y0 = cx + r * math.cos(R(a0)), cy - r * math.sin(R(a0))
    x1, y1 = cx + r * math.cos(R(a1)), cy - r * math.sin(R(a1))
    big = 1 if a1 - a0 > 180 else 0
    return f'<path d="M{x0:.1f} {y0:.1f} A{r} {r} 0 {big} 0 {x1:.1f} {y1:.1f}" fill="none" stroke="{col}" stroke-width="4"/>'


def _alab(cx, cy, r, ang, text):
    x, y = cx + r * math.cos(math.radians(ang)), cy - r * math.sin(math.radians(ang))
    return (f'<text x="{x:.1f}" y="{y + 6:.1f}" text-anchor="middle" font-size="17" font-weight="700" fill="var(--navy)" '
            f'paint-order="stroke" stroke="var(--card)" stroke-width="4">{html.escape(text)}</text>')


def fig_waves(waves, **_):
    """Sound waves to compare: [{"amp": 1, "cycles": 3, "label": "A"}, ...]  amp 0.3 to 1."""
    W, rowh = 320, 90
    g = []
    for k, w in enumerate(waves):
        y0 = 45 + k * rowh
        pts = " ".join(f"{40 + x:.1f},{y0 - 34 * w['amp'] * math.sin(2 * math.pi * w['cycles'] * x / 260):.1f}" for x in range(0, 261, 2))
        g.append(f'<path d="M40 {y0} H300" stroke="var(--line)" stroke-width="2"/>')
        g.append(f'<polyline points="{pts}" fill="none" stroke="{("var(--fun)", "var(--sci)", "var(--pink)")[k % 3]}" stroke-width="3.5"/>')
        g.append(f'<text x="14" y="{y0 + 6}" font-size="18" font-weight="700" fill="var(--navy)">{html.escape(w["label"])}</text>')
    return (f'<svg class="fig" viewBox="0 0 {W} {len(waves) * rowh}" width="{W}" height="{len(waves) * rowh}" role="img" '
            f'aria-label="{len(waves)} sound waves drawn on the same scale, labelled {html.escape(", ".join(w["label"] for w in waves))}">{"".join(g)}</svg>')


def fig_mirror(i=40, **_):
    """A ray hitting a flat mirror at angle of incidence i, with the normal and the reflected ray."""
    W, H, cx, cy, L = 300, 190, 150, 160, 130
    R = math.radians
    ix, iy = cx - L * math.sin(R(i)), cy - L * math.cos(R(i))
    rx, ry = cx + L * math.sin(R(i)), cy - L * math.cos(R(i))
    g = [f'<rect x="30" y="{cy}" width="240" height="12" fill="#C9D1DE" stroke="var(--navy)" stroke-width="2"/>',
         "".join(f'<path d="M{40 + 18 * k} {cy + 12} l-10 12" stroke="var(--navy)" stroke-width="2"/>' for k in range(13)),
         f'<path d="M{cx} {cy} V20" stroke="var(--navy)" stroke-width="2" stroke-dasharray="6 5"/>',
         f'<text x="{cx}" y="14" text-anchor="middle" font-size="13" fill="var(--muted)">normal</text>',
         f'<path d="M{ix:.1f} {iy:.1f} L{cx} {cy}" stroke="#E5484D" stroke-width="4"/>',
         f'<path d="M{cx} {cy} L{rx:.1f} {ry:.1f}" stroke="#E5484D" stroke-width="4"/>',
         _arrow_mid(ix, iy, cx, cy), _arrow_mid(cx, cy, rx, ry),
         _arc(cx, cy, 44, 90, 90 + i, "var(--fun)"), _alab(cx, cy, 64, 90 + i / 2, f"{i}°"),
         _arc(cx, cy, 40, 90 - i, 90, "var(--sci)"), _alab(cx, cy, 62, 90 - i / 2, "r")]
    return (f'<svg class="fig" viewBox="0 0 {W} {H + 14}" width="{W}" height="{H + 14}" role="img" '
            f'aria-label="A ray of light hits a flat mirror. The angle between the ray and the normal is {i} degrees; the reflected angle is marked r">{"".join(g)}</svg>')


def _arrow_mid(x0, y0, x1, y1):
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    a = math.atan2(y1 - y0, x1 - x0)
    p = [(mx + 9 * math.cos(a), my + 9 * math.sin(a)), (mx - 7 * math.cos(a) + 7 * math.sin(a), my - 7 * math.sin(a) - 7 * math.cos(a)),
         (mx - 7 * math.cos(a) - 7 * math.sin(a), my - 7 * math.sin(a) + 7 * math.cos(a))]
    return f'<path d="M{p[0][0]:.1f} {p[0][1]:.1f} L{p[1][0]:.1f} {p[1][1]:.1f} L{p[2][0]:.1f} {p[2][1]:.1f} Z" fill="#E5484D"/>'


topics.EXTRA_FIGS.update({"grid": fig_grid, "angles": fig_angles, "waves": fig_waves, "mirror": fig_mirror})


# ---------- batch 5: area and volume, transformations, circuits, static, magnets ----------
def art_area():
    return _svg(
        # cuboid
        f'<path d="M40 90 L110 90 L110 160 L40 160 Z" fill="{ORANGE}" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>'
        f'<path d="M40 90 L70 62 L140 62 L110 90 Z" fill="{SUN}" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>'
        f'<path d="M110 90 L140 62 L140 132 L110 160 Z" fill="#E07020" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>'
        + "".join(f'<path d="M{40 + 17.5 * k} 90 V160" stroke="{INK}" stroke-width="1.2" opacity=".5"/>' for k in range(1, 4))
        + "".join(f'<path d="M40 {90 + 17.5 * k} H110" stroke="{INK}" stroke-width="1.2" opacity=".5"/>' for k in range(1, 4))
        # rectangle with grid
        + f'<rect x="152" y="104" width="64" height="48" fill="{TEAL}" stroke="{INK}" stroke-width="3"/>'
        + "".join(f'<path d="M{152 + 16 * k} 104 V152" stroke="#fff" stroke-width="1.5"/>' for k in range(1, 4))
        + "".join(f'<path d="M152 {104 + 16 * k} H216" stroke="#fff" stroke-width="1.5"/>' for k in range(1, 3))
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" fill="{INK}"><text x="75" y="182" text-anchor="middle" font-size="15">4 cm</text>'
          f'<text x="184" y="172" text-anchor="middle" font-size="15">12 cm²</text>'
          f'<g transform="rotate(-6 180 60)"><rect x="150" y="40" width="70" height="32" rx="10" fill="{P}"/><text x="185" y="62" text-anchor="middle" font-size="17" fill="#fff">V = lwh</text></g></g>'
        + _sparkles((30, 50, 7, SUN), (214, 186, 5, PINK)),
        "A cuboid made of cubes, a rectangle of 12 squares and the volume formula V = lwh")


def art_transform():
    return _svg(
        f'<path d="M120 26 V178" stroke="{INK}" stroke-width="3" stroke-dasharray="7 6"/>'
        f'<path d="M50 70 L96 70 L96 96 L74 96 L74 140 L50 140 Z" fill="{P}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
        f'<path d="M190 70 L144 70 L144 96 L166 96 L166 140 L190 140 Z" fill="{PINK}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
        f'<circle cx="62" cy="82" r="4" fill="#fff"/><circle cx="178" cy="82" r="4" fill="#fff"/>'
        f'<path d="M84 160 q36 22 72 0" fill="none" stroke="{TEAL}" stroke-width="4"/><path d="M150 152 l8 8 l-10 6" fill="none" stroke="{TEAL}" stroke-width="4" stroke-linecap="round"/>'
        + f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700"><rect x="86" y="10" width="68" height="26" rx="10" fill="{SUN}" stroke="{INK}" stroke-width="2.5"/>'
          f'<text x="120" y="29" text-anchor="middle" font-size="15" fill="{INK}">mirror</text></g>'
        + _sparkles((30, 40, 7, SUN), (210, 40, 6, TEAL), (30, 170, 5, P)),
        "An L shape and its mirror image on the other side of a dashed mirror line")


def art_circuits():
    return _svg(
        f'<path d="M40 60 H200 V150 H40 Z" fill="none" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
        # cell
        f'<rect x="28" y="88" width="24" height="34" fill="var(--fun-bg)"/><path d="M28 98 H52 M34 110 H46" stroke="{INK}" stroke-width="4"/>'
        f'<rect x="12" y="76" width="22" height="58" rx="6" fill="#3BB273" stroke="{INK}" stroke-width="3" transform="rotate(0)"/><rect x="18" y="70" width="10" height="7" fill="{INK}"/>'
        # bulb
        f'<circle cx="120" cy="60" r="22" fill="{SUN}" stroke="{INK}" stroke-width="4"/><path d="M104 44 L136 76 M136 44 L104 76" stroke="{INK}" stroke-width="3"/>'
        + "".join(f'<path d="M{120 + 32 * math.cos(a)} {60 + 32 * math.sin(a)} l{8 * math.cos(a):.1f} {8 * math.sin(a):.1f}" stroke="{ORANGE}" stroke-width="4" stroke-linecap="round"/>'
                  for a in (math.pi * k / 4 for k in (4, 5, 6, 7, 0)))
        # switch
        + f'<rect x="100" y="140" width="40" height="20" fill="var(--fun-bg)"/><circle cx="102" cy="150" r="4" fill="{INK}"/><circle cx="138" cy="150" r="4" fill="{INK}"/>'
          f'<path d="M102 150 L136 146" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        # electrons
        + "".join(f'<circle cx="{x}" cy="{y}" r="5" fill="{BLUE}"/>' for x, y in ((200, 90), (200, 124), (170, 150), (70, 150), (40, 140), (80, 60), (170, 60)))
        + _sparkles((214, 30, 7, SUN), (216, 180, 6, P)),
        "A simple circuit with a cell, a glowing bulb and a closed switch")


def art_static():
    return _svg(
        # balloon
        f'<ellipse cx="96" cy="86" rx="46" ry="54" fill="{PINK}" stroke="{INK}" stroke-width="3.5"/>'
        f'<path d="M90 140 l6 8 l6 -8 Z" fill="{PINK}" stroke="{INK}" stroke-width="2.5"/><path d="M96 148 q-12 20 4 40" fill="none" stroke="{INK}" stroke-width="2"/>'
        f'<ellipse cx="78" cy="64" rx="10" ry="16" fill="#fff" opacity=".4"/>'
        + "".join(f'<text x="{x}" y="{y}" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">−</text>' for x, y in ((100, 82), (120, 106), (84, 112), (118, 66)))
        # hair standing up
        + f'<circle cx="190" cy="150" r="26" fill="#F4C7A1" stroke="{INK}" stroke-width="3"/>'
        + "".join(f'<path d="M{190 + 22 * math.cos(a):.1f} {150 + 22 * math.sin(a):.1f} q{-8 + 16 * (k % 2)} {-12} {30 * math.cos(a):.1f} {30 * math.sin(a) - 10:.1f}" fill="none" stroke="{ORANGE}" stroke-width="4" stroke-linecap="round"/>'
                  for k, a in enumerate(math.pi * (1.1 + .16 * j) for j in range(6)))
        + f'<circle cx="182" cy="150" r="2.5" fill="{INK}"/><circle cx="198" cy="150" r="2.5" fill="{INK}"/><path d="M182 160 q8 6 16 0" fill="none" stroke="{INK}" stroke-width="2.5"/>'
        + "".join(f'<text x="{x}" y="{y}" text-anchor="middle" font-size="18" font-weight="700" fill="{TEAL}">+</text>' for x, y in ((160, 112), (216, 108), (188, 104)))
        + f'<path d="M150 40 l-10 18 h10 l-8 18" fill="none" stroke="{SUN}" stroke-width="5" stroke-linejoin="round"/>'
        + _sparkles((30, 40, 7, SUN), (36, 170, 6, P)),
        "A negatively charged balloon pulling up the positively charged hair of a smiling child")


def art_magnets():
    field = "".join(f'<path d="M64 {104 - 4 * k} C{30 - 18 * k} {20 - 22 * k} {210 + 18 * k} {20 - 22 * k} 176 {104 - 4 * k}" fill="none" stroke="{TEAL}" stroke-width="2.5" stroke-dasharray="5 5"/>'
                    f'<path d="M64 {116 + 4 * k} C{30 - 18 * k} {200 + 22 * k} {210 + 18 * k} {200 + 22 * k} 176 {116 + 4 * k}" fill="none" stroke="{TEAL}" stroke-width="2.5" stroke-dasharray="5 5"/>' for k in range(2))
    clip = f'<path d="M196 150 h22 a6 6 0 0 0 0 -12 h-26 a5 5 0 0 0 0 10 h20" fill="none" stroke="#8A94A6" stroke-width="3.5" stroke-linecap="round"/>'
    return _svg(
        field + f'<rect x="60" y="92" width="60" height="36" rx="3" fill="#E5484D" stroke="{INK}" stroke-width="3"/><rect x="120" y="92" width="60" height="36" rx="3" fill="{BLUE}" stroke="{INK}" stroke-width="3"/>'
        f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="22" fill="#fff"><text x="90" y="118" text-anchor="middle">N</text><text x="150" y="118" text-anchor="middle">S</text></g>'
        + clip + _sparkles((26, 40, 7, SUN), (120, 186, 6, P)),
        "A bar magnet with its north and south poles, the magnetic field lines around it and a paper clip")


ART.update({"area": art_area, "transform": art_transform, "circuits": art_circuits, "static": art_static, "magnets": art_magnets})


def fig_rect(w, h, unit="cm", shape="rect", cut=None, **_):
    """A labelled rectangle (shape 'rect'), right triangle ('triangle'), or an L shape ('L', cut = [cw, ch] taken from the top right)."""
    k = min(220 / w, 140 / h)
    W, H = w * k + 90, h * k + 70
    x0, y0 = 50, 20
    X, Y = x0 + w * k, y0 + h * k
    lab = lambda x, y, t, anc="middle": (f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anc}" font-size="16" font-weight="700" fill="var(--navy)">{html.escape(t)}</text>')
    if shape == "triangle":
        g = [f'<path d="M{x0} {Y:.1f} H{X:.1f} L{x0} {y0} Z" fill="var(--fun-bg)" stroke="var(--navy)" stroke-width="3.5" stroke-linejoin="round"/>',
             f'<path d="M{x0} {Y - 14:.1f} h14 v14" fill="none" stroke="var(--navy)" stroke-width="2"/>',
             lab((x0 + X) / 2, Y + 24, f"{w:g} {unit}"), lab(x0 - 8, (y0 + Y) / 2 + 5, f"{h:g} {unit}", "end")]
        desc = f"A right-angled triangle with base {w:g} {unit} and height {h:g} {unit}"
    elif shape == "L":
        cw, ch = cut
        cx, cy = X - cw * k, y0 + ch * k
        g = [f'<path d="M{x0} {y0} H{cx:.1f} V{cy:.1f} H{X:.1f} V{Y:.1f} H{x0} Z" fill="var(--fun-bg)" stroke="var(--navy)" stroke-width="3.5" stroke-linejoin="round"/>',
             lab((x0 + X) / 2, Y + 24, f"{w:g} {unit}"), lab(x0 - 8, (y0 + Y) / 2 + 5, f"{h:g} {unit}", "end"),
             lab((x0 + cx) / 2, y0 - 6, f"{w - cw:g} {unit}"), lab(X + 8, (cy + Y) / 2 + 5, f"{h - ch:g} {unit}", "start")]
        desc = f"An L shape {w:g} {unit} wide and {h:g} {unit} tall, with a {cw:g} by {ch:g} piece cut from the top right corner"
        H += 10
        W += 30
    else:
        g = [f'<rect x="{x0}" y="{y0}" width="{w * k:.1f}" height="{h * k:.1f}" fill="var(--fun-bg)" stroke="var(--navy)" stroke-width="3.5"/>',
             lab((x0 + X) / 2, Y + 24, f"{w:g} {unit}"), lab(x0 - 8, (y0 + Y) / 2 + 5, f"{h:g} {unit}", "end")]
        desc = f"A rectangle {w:g} {unit} by {h:g} {unit}"
    return (f'<svg class="fig" viewBox="0 -10 {W:.0f} {H + 10:.0f}" width="{W:.0f}" height="{H + 10:.0f}" role="img" aria-label="{html.escape(desc, quote=True)}">{"".join(g)}</svg>')


def fig_cuboid(l, w, h, unit="cm", **_):
    k = min(150 / (l + w * .5), 120 / (h + w * .5))
    dx, dy = w * k * .5, w * k * .45
    x0, y0 = 50, 20 + dy
    L, Hh = l * k, h * k
    g = [f'<path d="M{x0} {y0} H{x0 + L:.1f} V{y0 + Hh:.1f} H{x0} Z" fill="var(--fun-bg)" stroke="var(--navy)" stroke-width="3"/>',
         f'<path d="M{x0} {y0} L{x0 + dx:.1f} {y0 - dy:.1f} H{x0 + L + dx:.1f} L{x0 + L:.1f} {y0} Z" fill="var(--sci-bg)" stroke="var(--navy)" stroke-width="3" stroke-linejoin="round"/>',
         f'<path d="M{x0 + L:.1f} {y0} L{x0 + L + dx:.1f} {y0 - dy:.1f} V{y0 + Hh - dy:.1f} L{x0 + L:.1f} {y0 + Hh:.1f} Z" fill="var(--gold-bg)" stroke="var(--navy)" stroke-width="3" stroke-linejoin="round"/>',
         f'<text x="{x0 + L / 2:.1f}" y="{y0 + Hh + 22:.1f}" text-anchor="middle" font-size="16" font-weight="700" fill="var(--navy)">{l:g} {unit}</text>',
         f'<text x="{x0 - 8}" y="{y0 + Hh / 2 + 5:.1f}" text-anchor="end" font-size="16" font-weight="700" fill="var(--navy)">{h:g} {unit}</text>',
         f'<text x="{x0 + L + dx / 2 + 10:.1f}" y="{y0 + Hh - dy / 2 + 18:.1f}" font-size="16" font-weight="700" fill="var(--navy)">{w:g} {unit}</text>']
    W, H = x0 + L + dx + 70, y0 + Hh + 34
    return (f'<svg class="fig" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}" role="img" '
            f'aria-label="A cuboid {l:g} {unit} long, {w:g} {unit} wide and {h:g} {unit} high">{"".join(g)}</svg>')


def _bulb(x, y):
    return (f'<circle cx="{x}" cy="{y}" r="14" fill="var(--card)" stroke="var(--navy)" stroke-width="3"/>'
            f'<path d="M{x - 10} {y - 10} L{x + 10} {y + 10} M{x + 10} {y - 10} L{x - 10} {y + 10}" stroke="var(--navy)" stroke-width="2.5"/>')


def _meter(x, y, letter, reading):
    return (f'<circle cx="{x}" cy="{y}" r="14" fill="var(--card)" stroke="var(--navy)" stroke-width="3"/>'
            f'<text x="{x}" y="{y + 6}" text-anchor="middle" font-size="16" font-weight="700" fill="var(--navy)">{letter}</text>'
            + (f'<text x="{x}" y="{y - 20}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--fun)" paint-order="stroke" stroke="var(--card)" stroke-width="4">{html.escape(reading)}</text>' if reading else ""))


def fig_circuit(kind="series", bulbs=2, readings=(), switch=False, **_):
    """Circuit diagram. series: a cell and `bulbs` bulbs in one loop, with an ammeter reading readings[0].
       parallel: a cell, an ammeter (readings[0]) and `bulbs` branches, each with a bulb and an ammeter (readings[1:])."""
    rd = list(readings) + [""] * 6
    nav = "var(--navy)"
    cell = (lambda x, y: f'<rect x="{x - 10}" y="{y - 16}" width="20" height="32" fill="var(--card)"/>'
            f'<path d="M{x - 4} {y - 16} V{y + 16}" stroke="{nav}" stroke-width="3"/><path d="M{x + 5} {y - 8} V{y + 8}" stroke="{nav}" stroke-width="6"/>')
    if kind == "series":
        W, H, x0, x1, y0, y1 = 320, 170, 30, 290, 40, 140
        g = [f'<path d="M{x0} {y0} H{x1} V{y1} H{x0} Z" fill="none" stroke="{nav}" stroke-width="3"/>', cell(160, y1)]
        for k in range(bulbs):
            g.append(_bulb(x0 + (x1 - x0) * (k + 1) / (bulbs + 2), y0))
        g.append(_meter(x0 + (x1 - x0) * (bulbs + 1) / (bulbs + 2), y0, "A", rd[0]))
        if switch:
            g.append(f'<rect x="{x0 - 6}" y="78" width="12" height="28" fill="var(--card)"/><circle cx="{x0}" cy="80" r="3.5" fill="{nav}"/>'
                     f'<circle cx="{x0}" cy="104" r="3.5" fill="{nav}"/><path d="M{x0} 104 L{x0 + 14} 82" stroke="{nav}" stroke-width="3"/>')
        desc = f"A series circuit: one cell, {bulbs} bulbs and an ammeter" + (f" reading {rd[0]}" if rd[0] else "") + (" and an open switch" if switch else "")
    else:
        xl, xr, y_top = 50, 300, 30
        y_bot = y_top + 60 * bulbs
        W, H = 330, y_bot + 30
        g = [f'<path d="M{xl} {y_top} V{y_bot} H{xr} V{y_top}" fill="none" stroke="{nav}" stroke-width="3"/>',
             cell(140, y_bot), _meter(220, y_bot, "A", rd[0])]
        for k in range(bulbs):
            yy = y_top + 60 * k
            g.append(f'<path d="M{xl} {yy} H{xr}" stroke="{nav}" stroke-width="3"/>')
            g.append(_bulb(140, yy))
            g.append(_meter(220, yy, "A", rd[k + 1]))
        desc = f"A parallel circuit: one cell and {bulbs} bulbs on separate branches, with ammeters" + (f" reading {', '.join(r for r in readings if r)}" if any(readings) else "")
    return (f'<svg class="fig" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{html.escape(desc, quote=True)}">{"".join(g)}</svg>')


topics.EXTRA_FIGS.update({"rect": fig_rect, "cuboid": fig_cuboid, "circuit": fig_circuit})
