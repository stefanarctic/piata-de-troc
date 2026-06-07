import importlib.util
import urllib.request

spec = importlib.util.spec_from_file_location(
    "fetch_all",
    r"C:\Projects\piata-de-troc\scripts\fetch-all.py",
)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

html = mod.fetch("https://piatadetroc.ro/listings/citroen-jumper-2-5/")
result = mod.parse_listing_detail(html, "citroen-jumper-2-5")
print(result["image"])
print(result["images"])
