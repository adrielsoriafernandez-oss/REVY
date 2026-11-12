"""Verify the deliverable's contents and extract an independent copy for installation/build QA."""
import sys
import zipfile
from pathlib import Path

archive = Path(sys.argv[1]).resolve()
destination = Path(sys.argv[2]).resolve()
required = ["package.json", "package-lock.json", "index.html", "tsconfig.json", "vite.config.ts", "README.md", ".gitignore", ".env.example", ".github/workflows/deploy.yml", "src/data/products.json", "scripts/sync-products.mjs", "scripts/fetch-product-images.mjs", "public/favicon.ico"]
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None, "ZIP integrity check failed"
    names = z.namelist()
    assert len(names) == len(set(names)), "Duplicate ZIP entries"
    for name in names:
        target = (destination / name).resolve()
        assert target.is_relative_to(destination), f"Unsafe archive path: {name}"
        assert name.startswith("revy/"), f"Unexpected root: {name}"
        assert not any(part in {"node_modules", ".git", "artifacts", "dist", ".aws", ".codex"} for part in Path(name).parts), f"Unexpected file: {name}"
        assert not Path(name).name.startswith(".env") or Path(name).name == ".env.example", "Environment secrets included"
    for name in required:
        assert "revy/" + name in names, f"Missing {name}"
    destination.mkdir(parents=True, exist_ok=False)
    z.extractall(destination)
    print(f"ZIP íntegro: {len(names)} entradas, raíz revy/, sin duplicados, secretos ni node_modules.")
    print(f"Copia independiente: {destination / 'revy'}")
