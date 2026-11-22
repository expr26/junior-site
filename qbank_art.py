"""Pictures for the question bank, drawn as inline SVG at build time (no image files, nothing from other sites).

art(key)   the big picture for a subject or topic page ("art" in qbank/subjects.json and qbank/<subject>/<topic>.json)
New question figures, registered into topics.EXTRA_FIGS so they work in "fig" everywhere:
  hundred  {"shade": 25}                         a 10 by 10 grid with the first `shade` squares coloured (percentages)
  spring   {"load": "2 N", "stretch": 2}         a spring hanging from a bar, unstretched and then with a weight (stretch 0 to 4)
"""
import html

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
