"""Fetch all listings from piatadetroc.ro and save to public/data/listings.json."""
import json
import os
import re
import html as html_lib
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://piatadetroc.ro"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; PiataDeTrocClone/1.0)"}


def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.read().decode("utf-8", errors="replace")


def strip_html(text):
    text = re.sub(r"<[^>]+>", " ", text or "")
    return html_lib.unescape(re.sub(r"\s+", " ", text).strip())


def get_sitemap_slugs():
    xml = fetch(f"{BASE}/wp-sitemap-posts-dp_listing-1.xml")
    return re.findall(r"listings/([^/]+)/", xml)


def parse_listing_card(html):
    listings = []
    articles = re.findall(
        r'<article[^>]*class="[^"]*directorypress-listing[^"]*"[^>]*>.*?</article>',
        html,
        re.DOTALL,
    )
    for art in articles:
        link_m = re.search(r'href="(https://piatadetroc\.ro/listings/([^/]+)/)"', art)
        title_m = re.search(r'alt="([^"]+)"', art)
        img_m = re.search(r'data-lazy="(https://piatadetroc\.ro/[^"]+)"', art)
        if not img_m:
            img_m = re.search(r'src="(https://piatadetroc\.ro/[^"]+)"', art)
        cat_m = re.search(r'class="listing-cat"[^>]*>([^<]+)', art)
        loc_m = re.search(r'class="listing-location"[^>]*>([^<]+)', art)
        if not link_m:
            continue
        slug = link_m.group(2)
        listings.append({
            "slug": slug,
            "title": html_lib.unescape(title_m.group(1) if title_m else slug),
            "url": link_m.group(1),
            "image": img_m.group(1) if img_m else "",
            "category": html_lib.unescape(cat_m.group(1).strip()) if cat_m else "",
            "location": html_lib.unescape(loc_m.group(1).strip()) if loc_m else "",
        })
    return listings


def parse_listing_detail(html, slug):
    def first(pat, source=None, group=1, flags=re.I | re.S):
        m = re.search(pat, source or html, flags)
        if not m:
            return ""
        val = m.group(group)
        return html_lib.unescape(val.strip()) if isinstance(val, str) else ""

    title = first(r'<h2[^>]*itemprop="name"[^>]*>([^<]+)')
    if not title:
        title = first(r'property="og:title" content="([^"]+)"')
        title = re.sub(r"\s*[-|]\s*Listings\s*$", "", title, flags=re.I).strip()

    description = first(r'property="og:description" content="([^"]+)"')
    if not description:
        desc_block = first(
            r'class="listing-content[^"]*"[^>]*>(.*?)</div>\s*</div>',
        )
        description = strip_html(desc_block)

    images = []
    og_image = first(r'property="og:image" content="([^"]+)"')
    if og_image:
        images.append(og_image)
    for pat in [
        r'href="(https://piatadetroc\.ro/wp-content/uploads/\d{4}/\d{2}/[^"]+\.(?:jpg|jpeg|png|webp))"',
        r'data-lazy="(https://piatadetroc\.ro/wp-content/uploads/\d{4}/\d{2}/[^"]+)"',
    ]:
        for img in re.findall(pat, html, re.I):
            if (
                img not in images
                and "bfi_thumb" not in img
                and "logo" not in img.lower()
                and "cropped-1a975cab" not in img
                and "-32x32" not in img
                and "-192x192" not in img
            ):
                images.append(img)

    metas = first(r'class="listing-metas-single[^"]*"[^>]*>(.*?)</div>\s*</div>')
    date = ""
    views = ""
    if metas:
        date = first(r'class="directorypress-listing-date"[^>]*>\s*([^<]+)', metas)
        views = first(r'class="listing-views"[^>]*>.*?(\d+)', metas, group=1)

    phone = first(
        r'directorypress-field-type-phone.*?field-content[^>]*>([^<]+)',
    ) or first(r'Telefon:.*?field-content[^>]*>([^<]+)')

    email = first(r'itemprop="email" content="([^"]+)"')
    address = first(
        r'directorypress-field-type-address.*?field-content[^>]*>([^<]+)',
    ) or first(r'Adresa:.*?field-content[^>]*>([^<]+)')

    category = first(r'directorypress-field-type-categories.*?field-content[^>]*>([^<]+)')
    if not category:
        category = first(r'class="listing-cat"[^>]*>([^<]+)')

    author = first(r'<p class="author-name"[^>]*>([^<]+)')
    member_since = first(r'class="author-reg-date"[^>]*>([^<]+)')

    return {
        "slug": slug,
        "title": title,
        "category": category,
        "location": address,
        "date": date,
        "views": views,
        "author": author,
        "memberSince": member_since,
        "phone": phone,
        "email": email,
        "description": description,
        "image": images[0] if images else first(r'property="og:image" content="([^"]+)"'),
        "images": images,
        "url": f"{BASE}/listings/{slug}/",
    }


def fetch_api_listings():
    try:
        return json.loads(fetch(f"{BASE}/wp-json/piata/v1/listings"))
    except Exception:
        return []


def main():
    print("Fetching sitemap...")
    slugs = get_sitemap_slugs()
    print(f"  {len(slugs)} listing slugs")

    print("Fetching API listings...")
    api_items = fetch_api_listings()
    api_by_title = {item["title"].lower(): item for item in api_items}

    print("Fetching listing cards from pages...")
    pages = [f"{BASE}/", f"{BASE}/listings/"] + [
        f"{BASE}/listings/business-category/{cat}/"
        for cat in [
            "servicii", "antichitati", "imobiliare", "sport", "masini",
            "telefoane-mobile", "mobilier", "electronice", "electrocasnice",
            "fashion", "animale", "carti", "jucarii", "cereale",
        ]
    ]

    cards_by_slug = {}
    for page in pages:
        try:
            for card in parse_listing_card(fetch(page)):
                cards_by_slug[card["slug"]] = card
        except Exception as e:
            print(f"  warn: {page}: {e}")
    print(f"  {len(cards_by_slug)} cards from HTML")

    print("Fetching listing details...")
    details_by_slug = {}

    def fetch_detail(slug):
        try:
            html = fetch(f"{BASE}/listings/{slug}/")
            return slug, parse_listing_detail(html, slug)
        except Exception:
            return slug, None

    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = [pool.submit(fetch_detail, slug) for slug in slugs]
        for i, future in enumerate(as_completed(futures), 1):
            slug, detail = future.result()
            if detail:
                details_by_slug[slug] = detail
            if i % 25 == 0:
                print(f"  {i}/{len(slugs)}")

    listings = []
    for slug in slugs:
        card = cards_by_slug.get(slug, {})
        detail = details_by_slug.get(slug, {})
        title = detail.get("title") or card.get("title") or slug.replace("-", " ").title()
        api = api_by_title.get(title.lower(), {})
        meta = api.get("meta", {}) if api else {}

        phone = detail.get("phone") or (meta.get("_field_6", [""])[0] if meta else "")
        email = detail.get("email") or (meta.get("_field_8", [""])[0] if meta else "")
        description = detail.get("description", "")
        if not description and api.get("content"):
            description = strip_html(api["content"])

        location = detail.get("location") or card.get("location") or (
            meta.get("_address_line_1", [""])[0] if meta else ""
        )

        def pick_best(candidates):
            full = [u for u in candidates if u and "bfi_thumb" not in u]
            if full:
                return full[0]
            thumb = [u for u in candidates if u and "bfi_thumb" in u]
            return thumb[0] if thumb else ""

        detail_images = [i for i in (detail.get("images") or []) if i]
        image = pick_best(detail_images)
        if not image:
            image = pick_best([detail.get("image"), card.get("image")])
        images = detail_images or ([image] if image else [])

        listings.append({
            "id": api.get("id") or abs(hash(slug)) % 10000000,
            "slug": slug,
            "title": title,
            "category": detail.get("category") or card.get("category") or "",
            "location": location,
            "image": image,
            "images": images,
            "date": detail.get("date", ""),
            "views": detail.get("views") or (meta.get("_total_clicks", [""])[0] if meta else ""),
            "author": detail.get("author", ""),
            "memberSince": detail.get("memberSince", ""),
            "phone": phone,
            "email": email,
            "description": description,
            "url": f"{BASE}/listings/{slug}/",
        })

    out_path = os.path.join(os.path.dirname(__file__), "..", "public", "data", "listings.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(listings, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(listings)} listings")


if __name__ == "__main__":
    main()
