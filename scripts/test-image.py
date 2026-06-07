import re
import urllib.request

HEADERS = {"User-Agent": "Mozilla/5.0"}
req = urllib.request.Request(
    "https://piatadetroc.ro/listings/citroen-jumper-2-5/",
    headers=HEADERS,
)
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
og = re.search(r'property="og:image" content="([^"]+)"', html)
hrefs = re.findall(
    r'href="(https://piatadetroc\.ro/wp-content/uploads/\d{4}/\d{2}/[^"]+\.(?:jpg|jpeg|png))"',
    html,
)
print("len", len(html))
print("og", og.group(1) if og else None)
print("hrefs", hrefs[:3])
