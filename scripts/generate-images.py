import os
import sys
import time
from google import genai
from google.genai import types
import base64
import pathlib

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY environment variable is not set.")
    print("  Set it with: export GEMINI_API_KEY='your-key-here'")
    sys.exit(1)
OUTPUT_DIR = pathlib.Path(__file__).parent.parent / "public" / "images" / "bouquets"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

client = genai.Client(api_key=API_KEY)

MASTER_STYLE = """Photorealistic product photography. Soft diffused natural lighting from the left.
Warm cream background (#F8F4EF). Canon R5, 85mm f/1.4, shallow depth of field.
Luxury artisan brand aesthetic. The subject is a HANDMADE pipe-cleaner bouquet
made from fuzzy chenille stems. Show the soft fuzzy texture on every petal
and stem clearly. These are NOT real flowers. They are handcrafted craft flowers
made by twisting and bending chenille pipe-cleaners. The texture should look
tactile, soft, and clearly handmade."""

PROMPTS = {
    "process-design.png": f"""{MASTER_STYLE}

Overhead birds-eye shot of a design workspace. On a clean white marble desk:
a hand-drawn sketch of a flower bouquet on cream paper, colored pencils in
pastel shades (pink, blue, purple, yellow), a few loose chenille pipe-cleaners
in various colors laid next to the sketch, and a small card.
Clean, minimal, organized. Soft natural window light from the left creating
gentle shadows. Creative, intentional, artisan mood.""",

    "process-handcraft.png": f"""{MASTER_STYLE}

Close-up of a woman's hands carefully bending and shaping a pink chenille
pipe-cleaner into a flower petal. On the light wooden work surface around her
hands: 3-4 completed pink pipe-cleaner petals, green pipe-cleaner stems,
small scissors, and a half-assembled pipe-cleaner lily flower. Natural window
light from the left. Shallow depth of field. Intimate, artisan feel.
The fuzzy chenille texture must be visible on the pipe-cleaners.""",

    "process-wrap.png": f"""{MASTER_STYLE}

A woman's hands carefully wrapping a completed pipe-cleaner flower bouquet
(pink lilies and small blue flowers, all made from fuzzy chenille pipe-cleaners)
in soft cream tissue paper. On the table: rolls of blush pink organza ribbon,
pearl-beaded string, a satin bow ready to be tied, and a small gift tag.
The bouquet is half-wrapped. Warm soft lighting. Luxury gift being prepared with care.""",

    "process-gift.png": f"""{MASTER_STYLE}

Two pairs of hands visible only — one person handing a beautifully wrapped pipe-cleaner
bouquet to another person. Only hands and forearms visible. The bouquet has
pink lilies and red tulips made from fuzzy chenille pipe-cleaners, wrapped
in cream paper with a pink ribbon bow. The receiving hands are reaching out
with fingers slightly open in surprise. Warm golden background light, soft bokeh.
Emotional, genuine, heartwarming.""",

    "process-keep.png": f"""{MASTER_STYLE}

A handmade pipe-cleaner flower bouquet (blue lilies made from fuzzy chenille
pipe-cleaners with pink ribbon) displayed beautifully on a white shelf in a cozy bedroom.
Next to it: a framed photo, a small candle, and a book. The bouquet looks
fresh and vibrant. Soft warm afternoon light from a window.
This bouquet has been a treasured keepsake — loved, displayed, still beautiful.""",

    "sunflower-styled.png": f"""{MASTER_STYLE}

A handmade pipe-cleaner sunflower bouquet. 2 bright yellow sunflowers with
dark brown fuzzy chenille centers and green pipe-cleaner stems with curly
tendrils. Wrapped in warm ivory/cream paper with a champagne satin ribbon
and a small gift tag. Placed on a marble surface with a small candle and
a ceramic vase with dried baby's breath in the soft background.
Warm cozy editorial feel. Shot at 45-degree angle. Portrait orientation.""",

    "purple-styled.png": f"""{MASTER_STYLE}

A handmade pipe-cleaner lavender bouquet held by a hand against a soft beige
linen backdrop. Contains: one large purple lily, one deep purple tulip, one
lavender sprig, and one small lavender accent flower — ALL made from fuzzy
chenille pipe-cleaners. Wrapped in soft lavender paper with cream satin bow.
Side angle, slightly tilted. Romantic, serene mood. Portrait orientation.""",

    "pink-lily-styled.png": f"""{MASTER_STYLE}

A handmade pipe-cleaner pink lily bouquet in a luxury lifestyle setting.
3 large pink lilies with visible fuzzy chenille texture, green pipe-cleaner
stems. Wrapped in blush pink paper with white tulle and pearl-beaded ribbon.
Placed on a marble countertop. In soft-focus background: stacked pastel
pink books, a small pink candle, and dried flowers in a vase.
Warm golden lighting. 45-degree angle. Portrait orientation.""",

    "blue-elegance.png": f"""{MASTER_STYLE}

A handmade pipe-cleaner blue lily bouquet. 4 sky blue lilies with white
edges and small blue accent flowers — all fuzzy chenille pipe-cleaners.
Wrapped in white/cream paper with a blue organza ribbon. Held by a hand
from the left side against a soft cream studio background with warm
natural light. Clean, elegant, premium. Portrait orientation.""",

    "collection-flatlay.png": f"""{MASTER_STYLE}

Overhead flat-lay of 3 handmade pipe-cleaner bouquets on a cream linen
surface: one yellow sunflower bouquet in cream wrap (left), one purple lily
bouquet in lavender wrap (center), one pink lily bouquet in pink wrap (right).
Between them: scattered dried baby's breath, a few loose chenille pipe-cleaner
petals, and a small cream card. Soft even lighting, no harsh shadows.
Editorial magazine-quality flat lay. Landscape orientation.""",

    "single-pink-sunset.png": f"""A single handmade pipe-cleaner pink flower — a simple 5-petal bloom made
from fuzzy pink chenille — wrapped in blush pink scalloped paper with a
small iridescent organza bow. Held up by a hand against a soft gradient
sunset sky (pink to lavender). The flower should feel delicate and precious.
Show the fuzzy chenille pipe-cleaner texture clearly. Minimalist, emotional, beautiful.
Portrait orientation.""",
}


def generate_image(prompt: str, filename: str):
    output_path = OUTPUT_DIR / filename
    if output_path.exists():
        print(f"  SKIP (exists): {filename}")
        return True

    print(f"  Generating: {filename}...")
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=prompt + "\n\nGenerate this image.",
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )

        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                with open(output_path, "wb") as f:
                    f.write(image_data)
                print(f"  SAVED: {filename} ({len(image_data)} bytes)")
                return True

        print(f"  WARN: No image in response for {filename}")
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'text') and part.text:
                print(f"    Text: {part.text[:200]}")
        return False

    except Exception as e:
        print(f"  ERROR: {filename} - {e}")
        return False


def main():
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Generating {len(PROMPTS)} images...\n")

    success = 0
    failed = []

    for i, (filename, prompt) in enumerate(PROMPTS.items()):
        if i > 0:
            print("  Waiting 15s (rate limit)...")
            time.sleep(15)
        ok = generate_image(prompt, filename)
        if ok:
            success += 1
        else:
            failed.append(filename)

    print(f"\nDone: {success}/{len(PROMPTS)} generated")
    if failed:
        print(f"Failed: {', '.join(failed)}")


if __name__ == "__main__":
    main()
