import re
import urllib.request

url = "https://piatadetroc.ro/listings/citroen-jumper-2-5/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")

patterns = [
    ("h1", r"<h1[^>]*>([^<]+)</h1>"),
    ("og_title", r'property="og:title" content="([^"]+)"'),
    ("og_image", r'property="og:image" content="([^"]+)"'),
    ("listing-cat", r'class="listing-cat"[^>]*>([^<]+)'),
    ("listing-date", r'class="directorypress-listing-date"[^>]*>([^<]+)'),
    ("listing-views", r'class="listing-views"[^>]*>\s*(\d+)'),
    ("author", r'class="author-displayname"[^>]*>([^<]+)'),
    ("content", r'class="listing-content[^"]*"[^>]*>(.*?)</div>'),
]

for label, pat in patterns:
    m = re.search(pat, html, re.S)
    val = m.group(1).strip()[:120] if m else None
    print(f"{label}: {val}")

print("\n--- gallery images ---")
for img in re.findall(r'wp-content/uploads/[^"\']+\.(?:jpg|jpeg|png|webp)', html)[:8]:
    print(img)
