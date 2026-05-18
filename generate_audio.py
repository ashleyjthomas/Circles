#!/usr/bin/env python3
"""Generate narration audio for the CIRCA study using ElevenLabs.

Setup:
    pip3 install elevenlabs

    Get an API key from https://elevenlabs.io (click your profile ->
    API Keys -> Create). Then set it as an environment variable in
    the same terminal you run this script from:

        export ELEVENLABS_API_KEY="your_key_here"

    Make sure the voice you want ("Shanny" below) is in your
    ElevenLabs account. If it is a Voice Library voice, click "Add"
    to add it to your account first.

Run:
    python3 generate_audio.py

Output:
    audio/intro.mp3, audio/q01.mp3 ... audio/q15.mp3, audio/thanks.mp3

IMPORTANT: the q01..q15 ids below must stay in the SAME ORDER as the
`questions` array in experiment.js / standalone-test.html. If you add,
remove, or reword a question, update the matching line here and re-run.
"""

import os
import sys
from pathlib import Path

from elevenlabs.client import ElevenLabs

# --- configuration ----------------------------------------------

# Voice to use. The script looks up its id by name from your account.
# If you already know the voice id, paste it into VOICE_ID and it
# will be used directly (you can copy it on elevenlabs.io: open the
# voice, then "ID" / "Copy Voice ID").
VOICE_NAME = "Shanny"
VOICE_ID = "qlnUbSLa6XkXV9pK52QP"

# Quality model. eleven_multilingual_v2 is a good, stable choice for
# pre-recorded study audio (generation latency does not matter here).
MODEL_ID = "eleven_multilingual_v2"

OUTPUT_FORMAT = "mp3_44100_128"

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


def resolve_voice_id(client: ElevenLabs) -> str:
    """Return VOICE_ID if set, otherwise look it up by VOICE_NAME."""
    if VOICE_ID:
        return VOICE_ID
    voices = client.voices.get_all().voices
    for v in voices:
        if v.name and v.name.lower() == VOICE_NAME.lower():
            return v.voice_id
    names = ", ".join(sorted(v.name for v in voices if v.name)) or "(none)"
    sys.exit(
        f"Voice '{VOICE_NAME}' was not found in your account.\n"
        f"Add it to your account on elevenlabs.io, or set VOICE_ID directly.\n"
        f"Voices currently in your account: {names}"
    )


def main() -> None:
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        sys.exit("Set the ELEVENLABS_API_KEY environment variable first "
                 "(see the comment block at the top of this file).")

    client = ElevenLabs(api_key=api_key)
    voice_id = resolve_voice_id(client)

    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"Generating {len(CLIPS)} audio files with voice '{VOICE_NAME}' ({voice_id})...")
    for clip_id, text in CLIPS.items():
        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id=MODEL_ID,
            output_format=OUTPUT_FORMAT,
        )
        out_path = OUTPUT_DIR / f"{clip_id}.mp3"
        with open(out_path, "wb") as f:
            for chunk in audio:
                if chunk:
                    f.write(chunk)
        print(f"  wrote audio/{clip_id}.mp3")
    print(f"Done. Files are in: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
