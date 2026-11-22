"""Pictures for science topics, drawn as inline SVG at build time. Registered into topics.EXTRA_FIGS.

  forces   {"obj": "box"|"car"|"ball"|"boat"|"person", "arrows": [{"dir": "left"|"right"|"up"|"down", "size": 4, "label": "4 N"}], "ground": true}
  magnets  {"left": "NS", "right": "NS"}   two bar magnets in a row; the facing poles show if they attract or repel
  journey  {"distance": "100 m", "time": "20 s", "obj": "car"|"person"|"bike"}
"""
import html

NAVY, GOLD, GOLD_LT, FUN, OK, BAD = "var(--navy)", "var(--gold)", "var(--gold-lt)", "var(--fun)", "var(--ok)", "var(--bad)"


def _svg(w, h, inner, label):
    return (f'<svg class="fig" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{html.escape(label, quote=True)}">'
            f'<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">'
            f'<path d="M0 0 L10 5 L0 10 z" fill="{FUN}"/></marker></defs>{inner}</svg>')


def _object(kind, cx, cy):
    if kind == "car":
        return (f'<rect x="{cx-50}" y="{cy-14}" width="100" height="30" rx="8" fill="{FUN}"/>'
                f'<path d="M{cx-30} {cy-14} L{cx-18} {cy-34} H{cx+16} L{cx+30} {cy-14} Z" fill="{FUN}"/>'
                f'<path d="M{cx-14} {cy-16} L{cx-8} {cy-28} H{cx+12} L{cx+20} {cy-16} Z" fill="var(--fun-bg)"/>'
                f'<circle cx="{cx-28}" cy="{cy+18}" r="11" fill="{NAVY}"/><circle cx="{cx+28}" cy="{cy+18}" r="11" fill="{NAVY}"/>'), 50, 34, 29
    if kind == "ball":
        return (f'<circle cx="{cx}" cy="{cy}" r="28" fill="{GOLD_LT}" stroke="{GOLD}" stroke-width="3"/>'
                f'<path d="M{cx-28} {cy} Q{cx} {cy+14} {cx+28} {cy}" fill="none" stroke="{GOLD}" stroke-width="2"/>'), 28, 28, 28
    if kind == "boat":
        return (f'<path d="M{cx-50} {cy-6} H{cx+50} L{cx+34} {cy+22} H{cx-34} Z" fill="{GOLD}"/>'
                f'<rect x="{cx-3}" y="{cy-50}" width="5" height="44" fill="{NAVY}"/><path d="M{cx+2} {cy-48} L{cx+34} {cy-12} H{cx+2} Z" fill="var(--card)" stroke="{NAVY}" stroke-width="2"/>'), 50, 50, 22
    if kind == "person":
        return (f'<circle cx="{cx}" cy="{cy-34}" r="12" fill="{NAVY}"/><path d="M{cx} {cy-22} V{cy+8} M{cx} {cy-14} L{cx-16} {cy-2} M{cx} {cy-14} L{cx+16} {cy-2} '
                f'M{cx} {cy+8} L{cx-12} {cy+30} M{cx} {cy+8} L{cx+12} {cy+30}" stroke="{NAVY}" stroke-width="6" stroke-linecap="round" fill="none"/>'), 18, 46, 30
    return (f'<rect x="{cx-40}" y="{cy-30}" width="80" height="60" rx="4" fill="{GOLD_LT}" stroke="{GOLD}" stroke-width="3"/>'
            f'<path d="M{cx-40} {cy-30} L{cx+40} {cy+30} M{cx+40} {cy-30} L{cx-40} {cy+30}" stroke="{GOLD}" stroke-width="2"/>'), 40, 30, 30


def fig_forces(obj="box", arrows=(), ground=False, water=False, **_):
    W, H, cx, cy = 320, 220, 160, 110
    shape, hw, hh, bottom = _object(obj, cx, cy)
    parts = []
    if ground:
        parts.append(f'<rect x="0" y="{cy + bottom}" width="{W}" height="{H - cy - bottom}" fill="var(--bg-alt)"/>'
                     f'<line x1="0" y1="{cy + bottom}" x2="{W}" y2="{cy + bottom}" stroke="var(--muted)" stroke-width="3"/>')
    if water:
        parts.append(f'<rect x="0" y="{cy + 6}" width="{W}" height="{H - cy - 6}" fill="var(--fun-bg)"/>'
                     f'<path d="M0 {cy + 6} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="{FUN}" stroke-width="2"/>')
    parts.append(shape)
    desc = []
    for a in arrows:
        n = max(1, min(10, float(a.get("size", 3))))
        L = 14 + n * 9
        d = a["dir"]
        if d == "right":   x1, y1, x2, y2, tx, ty, anc = cx + hw + 4, cy, cx + hw + 4 + L, cy, cx + hw + 8 + L / 2, cy - 10, "middle"
        elif d == "left":  x1, y1, x2, y2, tx, ty, anc = cx - hw - 4, cy, cx - hw - 4 - L, cy, cx - hw - 8 - L / 2, cy - 10, "middle"
        elif d == "up" and obj == "boat":   # from the deck, beside the mast
            x1, y1, x2, y2, tx, ty, anc = cx - 26, cy - 8, cx - 26, cy - 8 - L, cx - 34, cy - 8 - L / 2, "end"
        elif d == "up":    x1, y1, x2, y2, tx, ty, anc = cx, cy - hh - 4, cx, cy - hh - 4 - L, cx + 10, cy - hh - L / 2, "start"
        else:              x1, y1, x2, y2, tx, ty, anc = cx, cy + hh + 4, cx, cy + hh + 4 + L, cx + 10, cy + hh + 8 + L / 2, "start"
        if obj == "boat" and d == "down":
            x1, y1, x2, y2, tx, ty = cx, cy + 24, cx, cy + 24 + L, cx + 10, cy + 28 + L / 2
        parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{FUN}" stroke-width="6" marker-end="url(#ah)"/>')
        if a.get("label"):
            parts.append(f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="{anc}" font-size="17" font-weight="700" fill="{NAVY}" '
                         f'paint-order="stroke" stroke="var(--card)" stroke-width="4">{html.escape(a["label"])}</text>')
        desc.append(f'{a.get("label", "a force")} {"upwards" if d == "up" else "downwards" if d == "down" else "to the " + d}')
    names = {"box": "A box", "car": "A car", "ball": "A ball", "boat": "A boat", "person": "A person"}
    return _svg(W, H, "".join(parts), names.get(obj, "An object") + (" with forces: " + ", ".join(desc) if desc else ""))


def _magnet(x, y, poles):
    a, b = poles[0], poles[1]
    col = {"N": "#C0392B", "S": "#2563A8"}
    return (f'<rect x="{x}" y="{y}" width="60" height="44" fill="{col[a]}"/><rect x="{x+60}" y="{y}" width="60" height="44" fill="{col[b]}"/>'
            f'<text x="{x+30}" y="{y+30}" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">{a}</text>'
            f'<text x="{x+90}" y="{y+30}" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">{b}</text>')


def fig_magnets(left="NS", right="NS", **_):
    gap = 50
    inner = _magnet(10, 20, left) + _magnet(130 + gap, 20, right)
    return _svg(310 + gap - 50, 84, inner, f"Two bar magnets in a row. The {left[1]} pole of the first faces the {right[0]} pole of the second")


def fig_journey(distance="100 m", time="20 s", obj="car", **_):
    W, H = 320, 150
    parts = [f'<line x1="30" y1="110" x2="290" y2="110" stroke="var(--muted)" stroke-width="3"/>',
             f'<line x1="30" y1="96" x2="30" y2="124" stroke="{NAVY}" stroke-width="3"/><line x1="290" y1="96" x2="290" y2="124" stroke="{NAVY}" stroke-width="3"/>',
             f'<path d="M290 96 V60 l22 8 l-22 8" fill="{OK}" stroke="{NAVY}" stroke-width="2"/>',
             f'<line x1="40" y1="138" x2="280" y2="138" stroke="{FUN}" stroke-width="3" marker-start="url(#ah)" marker-end="url(#ah)"/>',
             f'<text x="160" y="132" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}" paint-order="stroke" stroke="var(--card)" stroke-width="6">{html.escape(distance)}</text>',
             f'<text x="160" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="{NAVY}">⏱ {html.escape(time)}</text>']
    shape = _object(obj if obj in ("car", "person", "ball") else "car", 80, 110 - (29 if obj == "car" else 30 if obj == "person" else 28))[0]
    parts.append(shape)
    return _svg(W, H, "".join(parts), f"A journey of {distance} that takes {time}")


FIGS = {"forces": fig_forces, "magnets": fig_magnets, "journey": fig_journey}
