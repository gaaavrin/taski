#!/usr/bin/env python3
"""Local HTTP server for Taski. Serves static files and handles state persistence."""
import http.server
import json
import os
import re
import sys
import webbrowser
import threading
import time
import pathlib
import urllib.request

PORT = 27852
ROOT = pathlib.Path(__file__).parent
STATE_FILE = ROOT / "state.json"


def _git(*args, cwd=ROOT):
    import subprocess
    try:
        r = subprocess.run(["git"] + list(args), cwd=cwd, capture_output=True, text=True, timeout=15)
        return r.returncode == 0, r.stdout.strip()
    except Exception:
        return False, ""


def git_pull():
    ok, out = _git("pull", "--rebase")
    if ok:
        print(f"  sync ↓ {out.splitlines()[0] if out else 'ok'}")


def git_push():
    _git("add", "state.json")
    ok, _ = _git("diff", "--cached", "--quiet")
    if ok:
        return  # нет изменений
    _git("commit", "-m", "state")
    _git("push")
ASSETS = ROOT / "assets"
FONTS_DIR = ASSETS / "fonts"

# ── Vendor JS bundles ─────────────────────────────────────────────────────────
VENDORS = {
    "react.js":     "https://unpkg.com/react@18.3.1/umd/react.development.js",
    "react-dom.js": "https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js",
    "babel.js":     "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js",
}

FONTS_CSS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Public+Sans:wght@400;500;600;700"
    "&family=Archivo:wght@400;500;600;700;800"
    "&family=Archivo+Narrow:wght@500;600;700;800"
    "&family=Space+Grotesk:wght@400;500;600;700"
    "&family=JetBrains+Mono:wght@400;500;600"
    "&display=swap"
)

# Chrome UA → Google Fonts returns woff2 (best format for macOS)
CHROME_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)


def _fetch(url, dest, label=""):
    tmp = pathlib.Path(str(dest) + ".tmp")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": CHROME_UA})
        with urllib.request.urlopen(req, timeout=30) as r, open(tmp, "wb") as f:
            total = int(r.headers.get("Content-Length", 0))
            done = 0
            while True:
                chunk = r.read(65536)
                if not chunk:
                    break
                f.write(chunk)
                done += len(chunk)
                if total and label:
                    pct = int(done * 100 / total)
                    print(f"\r  {label}: {pct}%", end="", flush=True)
        tmp.rename(dest)
        if label:
            print(f"\r  {label}: готово    ")
    except Exception as e:
        tmp.unlink(missing_ok=True)
        print(f"\n  ⚠ не удалось скачать {label or url}: {e}")


def ensure_assets():
    """Download vendor JS + Google Fonts on first run (needs internet once)."""
    ASSETS.mkdir(exist_ok=True)
    FONTS_DIR.mkdir(exist_ok=True)

    missing_vendors = [n for n in VENDORS if not (ASSETS / n).exists()]
    fonts_css = ASSETS / "fonts.css"
    need_fonts = not fonts_css.exists()

    if not missing_vendors and not need_fonts:
        return  # everything already cached

    print("Первый запуск: скачиваю ресурсы для офлайн-работы…")

    for name in missing_vendors:
        _fetch(VENDORS[name], ASSETS / name, name)

    if need_fonts:
        print("  Скачиваю шрифты…")
        try:
            req = urllib.request.Request(FONTS_CSS_URL, headers={"User-Agent": CHROME_UA})
            css = urllib.request.urlopen(req, timeout=20).read().decode("utf-8")

            font_urls = re.findall(r"url\(([^)]+)\)", css)
            local_css = css
            for raw_url in font_urls:
                url = raw_url.strip("'\"")
                import hashlib
                fname = hashlib.md5(url.encode()).hexdigest()[:12] + ".woff2"
                fpath = FONTS_DIR / fname
                if not fpath.exists():
                    _fetch(url, fpath)
                local_css = local_css.replace(raw_url, f"'/assets/fonts/{fname}'")

            fonts_css.write_text(local_css, encoding="utf-8")
            print("  Шрифты: готово")
        except Exception as e:
            print(f"  ⚠ шрифты не скачались ({e}) — буду использовать системные")

    print("Ресурсы загружены. Повторные запуски — полностью офлайн.\n")

class TaskiHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        pass  # Suppress request logs

    def do_GET(self):
        if self.path == "/api/state":
            self.send_state()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/state":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                state = json.loads(body)
                STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
                STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
                threading.Thread(target=git_push, daemon=True).start()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_DELETE(self):
        if self.path == "/api/state":
            try:
                if STATE_FILE.exists():
                    STATE_FILE.unlink()
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def send_state(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        if STATE_FILE.exists():
            self.wfile.write(STATE_FILE.read_bytes())
        else:
            self.wfile.write(b"null")

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

if __name__ == "__main__":
    NO_BROWSER = "--no-browser" in sys.argv
    ensure_assets()
    print("Синхронизация…")
    git_pull()
    print(f"Taski → http://localhost:{PORT}")

    if NO_BROWSER:
        with http.server.HTTPServer(("127.0.0.1", PORT), TaskiHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nStopped.")
    else:
        # HTTP сервер в фоне, pywebview на главном треде (требование macOS)
        httpd = http.server.HTTPServer(("127.0.0.1", PORT), TaskiHandler)
        threading.Thread(target=httpd.serve_forever, daemon=True).start()

        import webview

        # Очищаем кеш WebKit (общий с Safari) перед запуском
        try:
            from Foundation import NSURLCache
            NSURLCache.sharedURLCache().removeAllCachedResponses()
        except Exception:
            pass

        import random
        url = f"http://localhost:{PORT}/?t={random.randint(10000,99999)}"
        window = webview.create_window(
            title="Taski",
            url=url,
            width=1440,
            height=900,
            min_size=(900, 600),
            maximized=True,
        )
        webview.start()
        httpd.shutdown()
