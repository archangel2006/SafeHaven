import os, html, io

root_dir = r""

for subdir, _, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(subdir, file)
            try:
                with io.open(path, "r", encoding="utf-8") as f:
                    content = f.read()

                decoded = html.unescape(content)

                decoded = html.unescape(decoded)

                with io.open(path, "w", encoding="utf-8") as f:
                    f.write(decoded)

                print(f"✅ Cleaned: {path}")
            except Exception as e:
                print(f"⚠️ Error in {path}: {e}")

print("\n🎯 All HTML files cleaned successfully!")
