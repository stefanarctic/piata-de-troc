import re
import urllib.request

url = "https://piatadetroc.ro/listings/citroen-jumper-2-5/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")

# dump lines containing useful keywords
keywords = ["Jumper", "listing-title", "listing-metas", "author-display", "Contact", "Telefon", "Email", "Adresa", "Descriere", "listing-views", "directorypress-listing-date", "Loheux", "laheux"]
out = []
for kw in keywords:
    for m in re.finditer(rf'.{{0,80}}{re.escape(kw)}.{{0,120}}', html, re.I):
        line = m.group(0).replace("\n", " ")
        if "{" not in line[:30]:  # skip CSS
            out.append(f"[{kw}] {line[:200]}")

with open(r"C:\Projects\piata-de-troc\scripts\debug-out.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("done", len(out))
