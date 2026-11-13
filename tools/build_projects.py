# -*- coding: utf-8 -*-
"""Build static project landing pages, thumbnails and sitemap for lastie-folio.ru.

Run from the repository root:  python tools/build_projects.py
Project names, URLs and short descriptions are read from web-lab.js so the
live-preview tabs and these pages never drift apart.
"""
import html, json, os, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from project_content import CONTENT

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://lastie-folio.ru"
LASTMOD = "2026-11-13"
SHOTS = Path(os.environ.get("PORTFOLIO_SHOTS", ROOT.parent))  # parent holds the project folders
SHOT_FILES = {
    "levelseed": "levelseed/screenshots/levelseed.png",
    "pathfinding-visualizer": "pathfinding-visualizer/screenshots/pathfinding-visualizer.png",
    "branchbook": "branchbook/screenshots/branchbook.png",
    "photo-terrain": "photo-terrain/screenshots/photo-terrain.png",
    "tonal": "photo-palette/screenshots/tonal-photo-palette.png",
    "exposure-lab": "exposure-calculator/screenshots/exposure-lab.png",
    "pixel-animation-studio": "pixel-animation-studio/screenshots/pixel-animation-studio.png",
    "plant-growth": "plant-growth/screenshots/plant-growth.png",
    "waymark": "waymark/preview.png",
    "waterline": "waterline-lab/preview.png",
    "mendbook": "mendbook/screenshots/mendbook.png",
    "slatehouse": "slatehouse/screenshots/slatehouse.png",
}

esc = lambda s: html.escape(str(s), quote=True)


def load_projects():
    src = (ROOT / "web-lab.js").read_text(encoding="utf-8")
    block = re.search(r"const projects = (\[[\s\S]*?\n  \]);", src).group(1)
    js = "console.log(JSON.stringify(" + block + "))"
    out = subprocess.run(["node", "-e", js], capture_output=True, text=True, encoding="utf-8", check=True).stdout
    return json.loads(out)


def make_thumbs(projects):
    from PIL import Image
    target = ROOT / "projects" / "img"
    target.mkdir(parents=True, exist_ok=True)
    for p in projects:
        src = SHOTS / SHOT_FILES[p["id"]]
        if not src.exists():
            print("missing screenshot", src)
            continue
        with Image.open(src) as im:
            im = im.convert("RGB")
            width = 1200
            if im.width > width:
                im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
            im.save(target / f"{p['id']}.webp", "WEBP", quality=80, method=6)


COPY = {
    "ru": {
        "lang": "ru", "locale": "ru_RU", "prefix": "", "home": "/", "dev": "/programming.html",
        "dev_name": "Разработка", "all": "Все проекты", "open": "Открыть проект", "source": "Исходный код",
        "who": "Для кого", "what": "Что делает", "result": "Что получаете", "limits": "Ограничения",
        "other": "Другие проекты", "switch": "EN", "switch_label": "English version", "skip": "К содержимому",
        "crumb_home": "Lastie", "title": "{n} — {t} | Lastie",
        "desc": "{n}: {t} Проект Михаила Бедрина (Lastie), Уфа. {w}",
        "nav": "Направления портфолио", "photo": "Фото", "contact": "Связаться", "img_alt": "Скриншот проекта {n}",
        "footer": "ФОТОГРАФИЯ × ПРОГРАММИРОВАНИЕ", "top": "Наверх ↑",
    },
    "en": {
        "lang": "en", "locale": "en_US", "prefix": "/en", "home": "/en/", "dev": "/en/programming.html",
        "dev_name": "Development", "all": "All projects", "open": "Open the project", "source": "Source code",
        "who": "Who it is for", "what": "What it does", "result": "What you get", "limits": "Limits",
        "other": "Other projects", "switch": "RU", "switch_label": "Русская версия", "skip": "Skip to content",
        "crumb_home": "Lastie", "title": "{n} — {t} | Lastie",
        "desc": "{n}: {t} A project by Mikhail Bedrin (Lastie), Ufa. {w}",
        "nav": "Portfolio sections", "photo": "Photo", "contact": "Contact", "img_alt": "Screenshot of {n}",
        "footer": "PHOTOGRAPHY × PROGRAMMING", "top": "Back to top ↑",
    },
}

BRAND = ('<a class="brand" href="{home}" aria-label="Lastie">lastie<span class="brand-mark" aria-hidden="true">'
         '<svg viewBox="0 0 48 48" focusable="false"><path d="M24 4v40M24 4l-4 9m4-9 4 9M44 24H4m40 0-9-4m9 4-9 4M24 44V4m0 40-4-9m4 9 4-9M4 24h40m-40 0 '
         '9-4m-9 4 9 4M10 10l28 28m-28-28 9 3m-9-3 3 9m25 25-9-3m9 3-3-9M38 10 10 38m28-28-9 3m9-3-3 9M10 38l9-3m-9 3 3-9"/></svg></span></a>')


def page_url(lang, pid):
    return f"{SITE}{COPY[lang]['prefix']}/projects/{pid}/"


def render(p, lang, projects):
    c = COPY[lang]
    text = CONTENT[p["id"]][lang]
    name = p["name"]
    tags = p["typeRu"] if lang == "ru" else p["type"]
    url = page_url(lang, p["id"])
    alt_url = page_url("en" if lang == "ru" else "ru", p["id"])
    ru_url, en_url = page_url("ru", p["id"]), page_url("en", p["id"])
    title = c["title"].format(n=name, t=text["tagline"].rstrip("."))
    desc = c["desc"].format(n=name, t=text["tagline"], w=text["result"])
    if len(desc) > 300:
        desc = desc[:297].rstrip() + "…"
    img = f"{SITE}/projects/img/{p['id']}.webp"
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication", "name": name, "url": url, "description": text["what"],
                "applicationCategory": "WebApplication", "operatingSystem": "Any", "inLanguage": c["lang"],
                "image": img, "isAccessibleForFree": True,
                "offers": {"@type": "Offer", "price": "0", "priceCurrency": "RUB"},
                "sameAs": [p["url"], f"https://github.com/TheLastie/{p['repo']}"],
                "author": {"@type": "Person", "name": "Михаил Бедрин" if lang == "ru" else "Mikhail Bedrin",
                           "alternateName": "Lastie", "url": f"{SITE}{c['home']}"},
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Lastie", "item": f"{SITE}{c['home']}"},
                    {"@type": "ListItem", "position": 2, "name": c["dev_name"], "item": f"{SITE}{c['dev']}"},
                    {"@type": "ListItem", "position": 3, "name": name, "item": url},
                ],
            },
        ],
    }
    others = "".join(
        f'<li><a href="{c["prefix"]}/projects/{q["id"]}/"><b>{esc(q["name"])}</b>'
        f'<span>{esc(CONTENT[q["id"]][lang]["tagline"])}</span></a></li>'
        for q in projects if q["id"] != p["id"]
    )
    from PIL import Image
    with Image.open(ROOT / "projects" / "img" / f"{p['id']}.webp") as _im:
        iw, ih = _im.size
    tag_html = "".join(f"<span>{esc(t)}</span>" for t in tags)
    switch = f"{'/en' if lang == 'ru' else ''}/projects/{p['id']}/"
    return f"""<!doctype html>
<html lang="{c['lang']}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#efeee8">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="geo.region" content="RU-BA"><meta name="geo.placename" content="Уфа, Республика Башкортостан">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="ru" href="{ru_url}"><link rel="alternate" hreflang="en" href="{en_url}"><link rel="alternate" hreflang="x-default" href="{ru_url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Lastie"><meta property="og:locale" content="{c['locale']}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:url" content="{url}">
<meta property="og:image" content="{img}"><meta property="og:image:alt" content="{esc(c['img_alt'].format(n=name))}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/projects/project-page.css?v=1">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="project-page">
<a class="skip" href="#main">{c['skip']}</a>
<header class="header">{BRAND.format(home=c['home'])}
<nav aria-label="{c['nav']}"><a class="direction-tab" href="{c['prefix']}/photo.html"><span><b>Satellite</b><small>{c['photo']}</small></span></a><a class="direction-tab" href="{c['dev']}" aria-current="page"><span><b>Lastie</b><small>{c['dev_name']}</small></span></a></nav>
<a class="language-switch" href="{switch}" lang="{'en' if lang == 'ru' else 'ru'}" hreflang="{'en' if lang == 'ru' else 'ru'}" aria-label="{c['switch_label']}">{c['switch']}</a>
<a class="header-contact" href="https://t.me/MainBurns" target="_blank" rel="noopener">{c['contact']} <span>↗</span></a></header>
<main id="main" class="wrap pp">
<nav class="pp-crumbs" aria-label="breadcrumbs"><a href="{c['home']}">Lastie</a><span>/</span><a href="{c['dev']}">{c['dev_name']}</a><span>/</span><span>{esc(name)}</span></nav>
<section class="pp-hero"><div class="pp-tags">{tag_html}</div><h1>{esc(name)}</h1><p class="pp-tagline">{esc(text['tagline'])}</p>
<p class="pp-actions"><a class="pp-btn pp-btn-main" href="{p['url']}" rel="noopener">{c['open']} ↗</a><a class="pp-btn" href="https://github.com/TheLastie/{p['repo']}" rel="noopener">{c['source']} ↗</a></p></section>
<figure class="pp-shot"><img src="/projects/img/{p['id']}.webp" width="{iw}" height="{ih}" alt="{esc(c['img_alt'].format(n=name))}" loading="eager"></figure>
<section class="pp-body">
<div><h2>{c['who']}</h2><p>{esc(text['who'])}</p></div>
<div><h2>{c['what']}</h2><p>{esc(text['what'])}</p></div>
<div><h2>{c['result']}</h2><p>{esc(text['result'])}</p></div>
<div><h2>{c['limits']}</h2><p>{esc(text['limits'])}</p></div>
</section>
<section class="pp-more"><h2>{c['other']}</h2><ul>{others}</ul><p><a href="{c['dev']}#web-lab">{c['all']} →</a></p></section>
</main>
<footer class="wrap">{BRAND.format(home=c['home'])}<span>{c['footer']}</span><span>© 2026 LASTIE</span><a href="#">{c['top']}</a></footer>
</body></html>
"""


def sitemap(projects):
    static = [
        ("/", "/en/"), ("/photo.html", "/en/photo.html"), ("/programming.html", "/en/programming.html"),
    ]
    rows = []

    def entry(loc_ru, loc_en, loc):
        return (f'<url><loc>{SITE}{loc}</loc><lastmod>{LASTMOD}</lastmod>'
                f'<xhtml:link rel="alternate" hreflang="ru" href="{SITE}{loc_ru}"/>'
                f'<xhtml:link rel="alternate" hreflang="en" href="{SITE}{loc_en}"/>'
                f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{loc_ru}"/></url>')

    for ru, en in static:
        rows.append(entry(ru, en, ru))
        rows.append(entry(ru, en, en))
    for p in projects:
        ru, en = f"/projects/{p['id']}/", f"/en/projects/{p['id']}/"
        rows.append(entry(ru, en, ru))
        rows.append(entry(ru, en, en))
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
            + "\n".join(rows) + "\n</urlset>\n")


START, END = "<!--project-index:start-->", "<!--project-index:end-->"


def inject_index(projects):
    """Add a crawlable list of project pages to the programming pages (idempotent)."""
    for lang, path in (("ru", "programming.html"), ("en", "en/programming.html")):
        c = COPY[lang]
        f = ROOT / path
        t = f.read_text(encoding="utf-8")
        items = "".join(
            f'<li><a href="{c["prefix"]}/projects/{q["id"]}/"><b>{esc(q["name"])}</b><span>{esc(CONTENT[q["id"]][lang]["tagline"])}</span></a></li>'
            for q in projects)
        heading = "Описания проектов" if lang == "ru" else "Project write-ups"
        block = (f'{START}<section class="wrap pp-index" aria-labelledby="pp-index-title"><div class="pp-more">'
                 f'<h2 id="pp-index-title">{heading}</h2><ul>{items}</ul></div></section>{END}')
        if START in t:
            t = re.sub(re.escape(START) + r"[\s\S]*?" + re.escape(END), lambda m: block, t)
        else:
            t = t.replace('<section class="more wrap">', block + '<section class="more wrap">', 1)
            assert block in t, f"anchor not found in {path}"
        css = '<link rel="stylesheet" href="/projects/project-page.css?v=1">'
        if css not in t:
            t = t.replace('<link rel="canonical"', css + '<link rel="canonical"', 1)
        f.write_text(t, encoding="utf-8", newline="\n")


def main():
    projects = load_projects()
    assert {p["id"] for p in projects} == set(CONTENT) == set(SHOT_FILES), "project lists differ"
    make_thumbs(projects)
    for lang in ("ru", "en"):
        for p in projects:
            d = ROOT / COPY[lang]["prefix"].lstrip("/") / "projects" / p["id"]
            d.mkdir(parents=True, exist_ok=True)
            (d / "index.html").write_text(render(p, lang, projects), encoding="utf-8", newline="\n")
    inject_index(projects)
    (ROOT / "sitemap.xml").write_text(sitemap(projects), encoding="utf-8", newline="\n")
    print(f"built {len(projects) * 2} pages")


if __name__ == "__main__":
    main()
