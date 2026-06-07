import re
import json

path = r"C:\Projects\piata-de-troc\Piata de troc – Schimba rapid orice lucru.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

menus = re.findall(r'<a class="menu-item-link" href="[^"]*">([^<]+)</a>', content)
print("MENU:", menus)

cats = re.findall(
    r'title="([^"]+)".*?categories-name">([^<]+)</span><span class="categories-count">(\d+)</span>',
    content,
    re.DOTALL,
)
print("CATS:", cats)

# listing articles
articles = re.findall(
    r'<article[^>]*class="[^"]*directorypress-listing[^"]*"[^>]*>.*?</article>',
    content,
    re.DOTALL,
)
print("ARTICLES:", len(articles))

listings = []
for art in articles:
    title_m = re.search(r'alt="([^"]+)"', art)
    img_m = re.search(r'src="\./Piata de troc[^"]+/([^"]+)"', art)
    link_m = re.search(r'href="(https://piatadetroc\.ro/listings/[^"]+)"', art)
    loc_m = re.search(r'class="listing-location[^"]*"[^>]*>([^<]+)', art)
    cat_m = re.search(r'class="listing-cat[^"]*"[^>]*>([^<]+)', art)
    listings.append({
        "title": title_m.group(1) if title_m else "",
        "image": img_m.group(1) if img_m else "",
        "link": link_m.group(1) if link_m else "",
        "location": loc_m.group(1).strip() if loc_m else "",
        "category": cat_m.group(1).strip() if cat_m else "",
    })

# locations from locations widget
locs = re.findall(
    r'title="([^"]+)"><span class="location-icon".*?<span class="loaction-name">([^<]+)</span>',
    content,
    re.DOTALL,
)

# category icons
cat_icons = re.findall(
    r'title="([^"]+)"><span class="cat-icon"><img[^>]+src="\./Piata de troc[^"]+/([^"]+)"',
    content,
)

# fix categories - skip rss feed false positive
categories = []
seen = set()
for title, name, count in cats:
    if name in seen or "Flux" in title:
        continue
    seen.add(name)
    icon = next((i for t, i in cat_icons if t == title or t == name), "")
    categories.append({"name": name, "count": int(count), "icon": icon})

with open(r"C:\Projects\piata-de-troc\scripts\extracted-data.json", "w", encoding="utf-8") as f:
    json.dump(
        {
            "menus": menus,
            "categories": categories,
            "listings": listings,
            "locations": [{"title": t, "name": n} for t, n in locs],
        },
        f,
        ensure_ascii=False,
        indent=2,
    )
print("done", len(listings), "listings", len(categories), "cats", len(locs), "locs")
