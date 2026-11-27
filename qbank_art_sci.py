"""Topic and subject pictures for KS3 Chemistry and Biology in the question bank (inline SVG). Registered into qbank_art.ART."""
from qbank_art import ART, BLUE, INK, ORANGE, P, PINK, SUN, TEAL, _sparkles, _svg

GREEN, LEAF = "#2FA36B", "#7DD68B"


def _flask(x, y, liquid, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})"><path d="M-14 -60 h28 v34 l34 58 a10 10 0 0 1 -9 15 h-78 a10 10 0 0 1 -9 -15 l34 -58 Z" '
            f'fill="#fff" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
            f'<path d="M-30 8 h60 l14 24 a10 10 0 0 1 -9 15 h-70 a10 10 0 0 1 -9 -15 Z" fill="{liquid}"/>'
            f'<circle cx="-6" cy="24" r="5" fill="#fff" opacity=".7"/><circle cx="10" cy="16" r="3.5" fill="#fff" opacity=".7"/>'
            f'<rect x="-18" y="-66" width="36" height="8" rx="3" fill="{INK}"/></g>')


def art_chemistry():
    return _svg(_flask(90, 110, TEAL) + _flask(170, 130, PINK, .7)
                + f'<circle cx="168" cy="52" r="10" fill="{SUN}" stroke="{INK}" stroke-width="3"/><circle cx="196" cy="62" r="7" fill="{P}" stroke="{INK}" stroke-width="3"/>'
                + f'<line x1="176" y1="55" x2="190" y2="60" stroke="{INK}" stroke-width="3"/>' + _sparkles((30, 50, 7, SUN), (214, 170, 6, P)),
                "Chemistry pictures: two flasks with coloured liquids and a molecule")


def _cell(cx, cy, rx, ry, plant=False):
    if plant:
        out = (f'<rect x="{cx - rx}" y="{cy - ry}" width="{2 * rx}" height="{2 * ry}" rx="10" fill="{LEAF}" stroke="{GREEN}" stroke-width="6"/>'
               f'<rect x="{cx - rx + 14}" y="{cy - ry + 14}" width="{2 * rx - 28}" height="{2 * ry - 28}" rx="10" fill="#E8F7FF" stroke="{BLUE}" stroke-width="2"/>')
        out += "".join(f'<ellipse cx="{cx + dx}" cy="{cy + dy}" rx="9" ry="5" fill="{GREEN}"/>' for dx, dy in ((-rx + 22, -ry + 10), (rx - 24, ry - 12), (-rx + 20, ry - 14)))
    else:
        out = f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#FFD9E4" stroke="{PINK}" stroke-width="4"/>'
    return out + f'<circle cx="{cx + rx * .2}" cy="{cy - ry * .1}" r="{min(rx, ry) * .32}" fill="{P}" stroke="{INK}" stroke-width="3"/>'


def art_biology():
    leaf = (f'<path d="M150 150 C150 90 190 60 214 54 C214 110 190 150 150 150 Z" fill="{LEAF}" stroke="{GREEN}" stroke-width="4"/>'
            f'<path d="M150 150 L204 66" stroke="{GREEN}" stroke-width="3"/>')
    return _svg(_cell(84, 96, 52, 40) + leaf + _sparkles((40, 170, 6, SUN), (200, 180, 6, P), (30, 40, 6, TEAL)),
                "Biology pictures: an animal cell and a leaf")


def art_atoms():
    s = ""
    for x, y, c in ((70, 80, P), (120, 120, PINK), (170, 80, TEAL)):
        s += f'<circle cx="{x}" cy="{y}" r="22" fill="{c}" stroke="{INK}" stroke-width="4"/>'
    s += f'<line x1="88" y1="94" x2="102" y2="106" stroke="{INK}" stroke-width="5"/><line x1="152" y1="94" x2="138" y2="106" stroke="{INK}" stroke-width="5"/>'
    s += f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="20" fill="#fff" text-anchor="middle"><text x="70" y="87">H</text><text x="120" y="127">O</text><text x="170" y="87">H</text></g>'
    s += f'<rect x="50" y="150" width="30" height="30" rx="4" fill="{SUN}" stroke="{INK}" stroke-width="3"/><text x="65" y="172" text-anchor="middle" font-size="16" font-weight="700" fill="{INK}">Fe</text>'
    s += f'<rect x="160" y="150" width="30" height="30" rx="4" fill="{SUN}" stroke="{INK}" stroke-width="3"/><text x="175" y="172" text-anchor="middle" font-size="16" font-weight="700" fill="{INK}">Na</text>'
    return _svg(s, "A water molecule made of two hydrogen atoms and one oxygen atom, and element symbols")


def art_mixtures():
    s = (f'<path d="M70 40 h100 l-40 60 v30 h-20 v-30 Z" fill="#fff" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
         f'<path d="M78 46 h84 l-34 50 h-16 Z" fill="#E9D7B0"/>'
         + "".join(f'<circle cx="{x}" cy="{y}" r="3" fill="#B48A4A"/>' for x, y in ((100, 60), (112, 70), (124, 58), (136, 66), (118, 84)))
         + f'<path d="M90 140 h60 v40 a8 8 0 0 1 -8 8 h-44 a8 8 0 0 1 -8 -8 Z" fill="#fff" stroke="{INK}" stroke-width="4"/>'
         f'<rect x="94" y="160" width="52" height="24" rx="4" fill="#BEE6FF"/><path d="M120 132 v18" stroke="{BLUE}" stroke-width="4" stroke-dasharray="4 5"/>')
    return _svg(s + _sparkles((40, 60, 7, SUN), (200, 150, 6, P)), "Filtering: sand is caught in a funnel and clear water drips into a beaker")


def art_acids():
    cols = ["#E5484D", "#F2713B", "#F5A524", "#E8D33A", "#8BCB45", "#2FA36B", "#2B9BB5", "#3B6FD8", "#6C4DF6", "#7E3BB8"]
    s = "".join(f'<rect x="{24 + i * 19}" y="80" width="19" height="40" fill="{c}"/>' for i, c in enumerate(cols))
    s += f'<rect x="24" y="80" width="190" height="40" fill="none" stroke="{INK}" stroke-width="4" rx="4"/>'
    s += f'<g font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="16" fill="{INK}"><text x="28" y="146">acid</text><text x="104" y="146">7</text><text x="168" y="146">alkali</text></g>'
    s += f'<circle cx="60" cy="50" r="20" fill="#FFE45C" stroke="{INK}" stroke-width="4"/><path d="M60 30 v40 M40 50 h40" stroke="{INK}" stroke-width="2"/>'
    return _svg(s + _sparkles((200, 46, 7, P), (40, 180, 6, TEAL)), "The pH colour scale from red acids through green neutral to purple alkalis, and a lemon")


def art_reactions():
    s = (f'<path d="M100 30 v110 a20 20 0 0 0 40 0 v-110" fill="#fff" stroke="{INK}" stroke-width="4"/>'
         f'<path d="M102 90 v50 a18 18 0 0 0 36 0 v-50 Z" fill="{ORANGE}"/>'
         + "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" stroke="{INK}" stroke-width="2"/>' for x, y, r in ((112, 120, 4), (126, 104, 5), (118, 70, 5), (130, 50, 6), (110, 36, 4)))
         + f'<path d="M60 180 h120" stroke="{INK}" stroke-width="4"/><path d="M110 176 q10 -24 20 0 Z" fill="{SUN}" stroke="{INK}" stroke-width="3"/>')
    return _svg(s + _sparkles((40, 50, 7, SUN), (200, 60, 7, PINK), (200, 160, 6, P)), "A test tube with a bubbling orange liquid over a small flame")


def art_cells():
    return _svg(_cell(80, 100, 48, 38) + _cell(170, 100, 40, 54, plant=True), "An animal cell and a plant cell, each with a nucleus; the plant cell has a cell wall and chloroplasts")


def art_body():
    heart = (f'<path d="M120 170 C60 130 50 80 84 66 C104 58 116 72 120 84 C124 72 136 58 156 66 C190 80 180 130 120 170 Z" '
             f'fill="#E5484D" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
             f'<path d="M104 64 v-26 M136 64 v-26" stroke="{BLUE}" stroke-width="8" stroke-linecap="round"/>')
    return _svg(heart + _sparkles((40, 60, 7, SUN), (200, 50, 6, P), (200, 170, 6, TEAL)), "A heart with blood vessels")


def art_digestion():
    s = (f'<circle cx="100" cy="110" r="44" fill="#E5484D" stroke="{INK}" stroke-width="4"/>'
         f'<path d="M100 66 q4 -20 14 -26" stroke="#7A4A1E" stroke-width="5" fill="none"/>'
         f'<path d="M114 52 q20 -14 30 0 q-14 10 -30 0 Z" fill="{LEAF}" stroke="{GREEN}" stroke-width="3"/>'
         f'<ellipse cx="84" cy="96" rx="9" ry="14" fill="#fff" opacity=".35"/>'
         f'<rect x="150" y="120" width="56" height="40" rx="10" fill="{SUN}" stroke="{INK}" stroke-width="4"/>'
         f'<path d="M160 130 h36 M160 140 h36 M160 150 h24" stroke="{INK}" stroke-width="2.5"/>')
    return _svg(s + _sparkles((40, 40, 7, P), (200, 60, 6, TEAL)), "An apple and a food label")


def art_ecosystems():
    s = (f'<path d="M30 150 q10 -40 20 0 q10 -40 20 0 Z" fill="{LEAF}" stroke="{GREEN}" stroke-width="3"/>'
         f'<ellipse cx="118" cy="140" rx="24" ry="16" fill="#D9C4A8" stroke="{INK}" stroke-width="3"/>'
         f'<ellipse cx="108" cy="116" rx="5" ry="16" fill="#D9C4A8" stroke="{INK}" stroke-width="3"/><ellipse cx="120" cy="114" rx="5" ry="16" fill="#D9C4A8" stroke="{INK}" stroke-width="3"/>'
         f'<path d="M168 150 l14 -36 l14 20 l14 -20 l2 36 Z" fill="{ORANGE}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
         f'<path d="M74 136 h16 M148 136 h14" stroke="{INK}" stroke-width="4" marker-end="url(#eco-ah)"/>'
         f'<defs><marker id="eco-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="{INK}"/></marker></defs>'
         f'<circle cx="190" cy="50" r="20" fill="{SUN}"/>')
    return _svg(s + _sparkles((40, 50, 6, P)), "A food chain: grass, then a rabbit, then a fox, with the Sun above")


ART.update({"chemistry": art_chemistry, "biology": art_biology, "atoms": art_atoms, "mixtures": art_mixtures, "acids": art_acids,
            "reactions": art_reactions, "cells": art_cells, "body": art_body, "digestion": art_digestion, "ecosystems": art_ecosystems})
