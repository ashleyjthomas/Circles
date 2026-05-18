#!/usr/bin/env python3
"""Generate narration audio for the CIRCA study using edge-tts.

edge-tts is free and needs no API key -- it uses Microsoft's neural
voices. We use a child-sounding US English voice, slowed slightly so
4-6 year-olds can follow along.

Setup:
    pip3 install edge-tts

Run:
    python3 generate_audio.py

Output:
    audio/intro.mp3, audio/q01.mp3 ... audio/q15.mp3, audio/thanks.mp3

IMPORTANT: the q01..q15 ids below must stay in the SAME ORDER as the
`questions` array in experiment.js / standalone-test.html. If you add,
remove, or reword a question, update the matching line here and re-run
this script.
"""

import asyncio
from pathlib import Path

import edge_tts

# en-US-AnaNeural is a child-sounding US English neural voice.
# To hear other options, run:  edge-tts --list-voices
VOICE = "en-US-AnaNeural"

# Slightly slowed delivery for young children. Use e.g. "+0%" for
# normal speed or "-20%" for slower.
RATE = "-10%"

OUTPUT_DIR = Path(__file__).parent / "audio"

# clip id -> text to speak
CLIPS = {
    "intro": "I'll ask you some questions. You point to the answer each time. "
             "Whatever answer you think is best.",
    "q01": "Which ones eat from the same plate?",
    "q02": "Which ones like to dress just like one another?",
    "q03": "Which ones are all the same inside?",
    "q04": "Which ones dance together?",
    "q05": "Which ones hold hands?",
    "q06": "Which ones know who is older and who is younger?",
    "q07": "Which ones have someone who gets to go first?",
    "q08": "Which ones care about who is biggest?",
    "q09": "Which ones have someone who is strongest, and someone who is next strongest?",
    "q10": "Which ones care about who is in front and who is behind?",
    "q11": "Which ones take turns?",
    "q12": "Which ones divide cookies evenly, so each one gets the same number?",
    "q13": "When others give them something, which ones give back the same kind of thing?",
    "q14": "Which ones decide by flipping a coin, playing rock paper scissors, "
           "or going Eeny, meeny, miny, moe?",
    "q15": "Which ones clean up equally?",
    "thanks": "Thank you for playing!",
}


async def synth(clip_id: str, text: str) -> None:
    out_path = OUTPUT_DIR / f"{clip_id}.mp3"
    communicate = edge_tts.Communicate(text, voice=VOICE, rate=RATE)
    await communicate.save(str(out_path))
    print(f"  wrote audio/{clip_id}.mp3")


async def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"Generating {len(CLIPS)} audio files with voice '{VOICE}' (rate {RATE})...")
    for clip_id, text in CLIPS.items():
        await synth(clip_id, text)
    print(f"Done. Files are in: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
