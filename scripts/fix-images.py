"""Fill missing listing images from og:image meta tags."""
import json
import os
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://piatadetroc.ro"
HEADERS = {"User-Agent": "Mozilla/5.0"}
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "data", "listings.json")


def fetch_og_image(slug):
    url = f"{BASE}/listings/{slug}/"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    except Exception:
        return slug, "", []

    og = re.search(r'property="og:image" content="([^"]+)"', html)
    image = og.group(1) if og else ""

    gallery = []
    if image:
        gallery.append(image)
    for img in re.findall(
        r'(?:href|data-lazy)="(https://piatadetroc\.ro/wp-content/uploads/\d{4}/\d{2}/[^"]+\.(?:jpg|jpeg|png|webp))"',
        html,
        re.I,
    ):
        if img not in gallery and "logo" not in img.lower() and "cropped-1a975cab" not in img:
            gallery.append(img)

    if not image and gallery:
        image = gallery[0]

    return slug, image, gallery


def main():
    with open(DATA_PATH, encoding="utf-8") as f:
        listings = json.load(f)

    need_fix = [l for l in listings if not l.get("image")]
    print(f"Fixing {len(need_fix)} listings without images...")

    by_slug = {l["slug"]: l for l in listings}

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(fetch_og_image, l["slug"]): l["slug"] for l in need_fix}
        done = 0
        for future in as_completed(futures):
            slug, image, gallery = future.result()
            if image:
                by_slug[slug]["image"] = image
                by_slug[slug]["images"] = gallery or [image]
            done += 1
            if done % 20 == 0:
                print(f"  {done}/{len(need_fix)}")

    fixed = sum(1 for l in listings if l.get("image"))
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(listings, f, ensure_ascii=False, indent=2)

    print(f"Done. {fixed}/{len(listings)} listings now have images.")


if __name__ == "__main__":
    main()
