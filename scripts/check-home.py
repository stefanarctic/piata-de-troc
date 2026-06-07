import re
import urllib.request

url = "https://piatadetroc.ro/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")

articles = re.findall(
    r'<article[^>]*class="[^"]*directorypress-listing[^"]*"[^>]*>.*?</article>',
    html,
    re.DOTALL,
)
print("articles", len(articles))
for art in articles[:3]:
    link = re.search(r'listings/([^/]+)/', art)
    img = re.search(r'(?:src|data-lazy)="([^"]+)"', art)
    print(link.group(1) if link else "?", (img.group(1)[:80] if img else "NO IMG"))
