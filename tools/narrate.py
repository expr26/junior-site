"""Record the narration for the theory videos (videos/<subject>/<topic>.json) as small MP3 files.

    pip install kokoro-onnx soundfile        (and ffmpeg on the PATH)
    KOKORO_DIR=/path/to/models python3 tools/narrate.py [subject/topic ...]

Voice: Kokoro (Apache-2.0), offline, British English, the same engine as the examinerprep.com videos.
Models: kokoro-v1.0.onnx and voices-v1.0.bin from github.com/thewh1teagle/kokoro-onnx (release model-files-v1.0).

Writes static/audio/videos/<subject>/<topic>/<chapter>-<step>.mp3 (both counted from 1) and a manifest.json
with a hash of every line, so only changed lines are recorded again. The first step of each chapter starts with
"Part N. <chapter title>." while the title card is on screen. The site build does not need Kokoro: it only
checks that every step has its file (videos.py).
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
SRC = HERE / "videos"
OUT = HERE / "static" / "audio" / "videos"
VOICE = os.environ.get("VOICE", "bm_george")
SPEED = float(os.environ.get("SPEED", "0.95"))
MODELS = Path(os.environ.get("KOKORO_DIR", "/tmp/kk"))
NUM = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]


def spoken(step):
    """What the voice says for a step: its "speak" text, or its caption with units read as words (same rules as theory.js)."""
    if step.get("speak"):
        return step["speak"]
    t = re.sub(r"<[^>]+>", " ", step["say"]).replace("**", "")
    for pat, rep in [(r"(\d)\s*N/kg", r"\1 newtons per kilogram"), (r"(\d)\s*N\b", r"\1 newtons"), (r"(\d)\s*kg\b", r"\1 kilograms"),
                     (r"(\d)\s*cm\b", r"\1 centimetres"), (r"(\d)\s*m/s\b", r"\1 metres per second"),
                     ("×", " times "), ("−", " minus "), (" = ", " equals ")]:
        t = re.sub(pat, rep, t)
    return re.sub(r"\s+", " ", t).strip()


def lines(v):
    out = {}
    for c, ch in enumerate(v["chapters"], 1):
        for s, st in enumerate(ch["steps"], 1):
            text = spoken(st)
            if s == 1:
                head = spoken({"say": ch["title"]}).replace("=", " equals ")
                text = f"Part {NUM[c] if c < len(NUM) else c}. {head.rstrip('?!.')}{'?' if head.endswith('?') else '.'} ... {text}"
            out[f"{c}-{s}"] = text
    return out


def main(only):
    from kokoro_onnx import Kokoro
    import soundfile as sf
    tts = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))

    def record(text, dest):
        audio, sr = tts.create(text, voice=VOICE, speed=SPEED, lang="en-gb")
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            sf.write(tmp.name, audio, sr)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name, "-af", "apad=pad_dur=0.25",
                            "-ac", "1", "-c:a", "libmp3lame", "-b:a", "48k", str(dest)], check=True)
        return round(len(audio) / sr, 2)

    end = OUT / "end.mp3"
    voice_file = OUT / "end.voice"
    if not end.exists() or not voice_file.exists() or voice_file.read_text() != VOICE:
        OUT.mkdir(parents=True, exist_ok=True)
        record("You watched the whole video! Well done.", end)
        (OUT / "end.voice").write_text(VOICE)

    for f in sorted(SRC.glob("*/*.json")):
        key = f"{f.parent.name}/{f.stem}"
        if only and key not in only:
            continue
        v = json.loads(f.read_text(encoding="utf-8"))
        d = OUT / f.parent.name / f.stem
        d.mkdir(parents=True, exist_ok=True)
        mpath = d / "manifest.json"
        old = json.loads(mpath.read_text()).get("lines", {}) if mpath.exists() else {}
        new, made = {}, 0
        for name, text in lines(v).items():
            h = hashlib.sha1(f"{VOICE}|{SPEED}|{text}".encode()).hexdigest()[:12]
            if old.get(name, {}).get("h") == h and (d / f"{name}.mp3").exists():
                new[name] = old[name]
                continue
            new[name] = {"h": h, "s": record(text, d / f"{name}.mp3"), "text": text}
            made += 1
        for stale in set(p.stem for p in d.glob("*.mp3")) - set(new):
            (d / f"{stale}.mp3").unlink()
        mpath.write_text(json.dumps({"voice": VOICE, "lines": new}, indent=1, ensure_ascii=False), encoding="utf-8")
        print(f"{key}: {made} recorded, {len(new) - made} unchanged, {sum(x['s'] for x in new.values()):.0f} s")


if __name__ == "__main__":
    main(set(sys.argv[1:]))
