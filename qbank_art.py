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
