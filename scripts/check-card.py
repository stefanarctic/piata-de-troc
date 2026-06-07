import re
import urllib.request

url = "https://piatadetroc.ro/listings/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")

slug = "apple-airpods3-aproape-noi"
idx = html.find(slug)
print("found", idx > 0)
chunk = html[idx - 500 : idx + 1500] if idx > 0 else ""
for pat in [
    r'src="([^"]+)"',
    r'data-lazy="([^"]+)"',
    r'alt="([^"]+)"',
]:
    for m in re.finditer(pat, chunk):
        print(pat[:20], m.group(1)[:100])
