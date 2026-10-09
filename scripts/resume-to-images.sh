#!/usr/bin/env bash
# Render a résumé PDF to watermarked page images for the site (brief §6).
#
#   scripts/resume-to-images.sh <path-to-resume.pdf> [--out <dir>] [--no-content]
#
# - Reads the PDF from wherever it lives and NEVER copies it into the repo.
# - Redacts the phone number on the contact line, closing the gap so
#   "• Bengaluru, India" sits next to the email.
# - Adds a faint diagonal watermark, writes page-N.png + page-N.webp.
# - Rewrites the generated block in src/content/resume.ts with page sizes.
#
# --out <dir>    write images somewhere else (e.g. a temp dir to preview)
# --no-content   don't touch src/content/resume.ts
#
# Requires: poppler (pdftoppm, pdftotext), ImageMagick 7 (magick), webp (cwebp), python3.
#   brew install poppler imagemagick webp

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/resume"
WRITE_CONTENT=1
DPI=200
WATERMARK="kshitijchaubey.github.io"
WATERMARK_OPACITY="0.07"
# ImageMagick needs a font file path; override with WATERMARK_FONT=/path/to/font.ttf.
if [[ -z "${WATERMARK_FONT:-}" ]]; then
  for f in "/System/Library/Fonts/Supplemental/Andale Mono.ttf" \
           "/System/Library/Fonts/Supplemental/Courier New.ttf" \
           /usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf; do
    [[ -f "$f" ]] && { WATERMARK_FONT="$f"; break; }
  done
fi
: "${WATERMARK_FONT:?no monospace font found; set WATERMARK_FONT=/path/to/font.ttf}"

PDF=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --out) OUT="$2"; shift 2 ;;
    --no-content) WRITE_CONTENT=0; shift ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) PDF="$1"; shift ;;
  esac
done

[[ -n "$PDF" && -f "$PDF" ]] || { echo "usage: $0 <path-to-resume.pdf> [--out dir] [--no-content]" >&2; exit 1; }

for tool in pdftoppm pdftotext magick cwebp python3; do
  command -v "$tool" >/dev/null || { echo "missing: $tool (brew install poppler imagemagick webp)" >&2; exit 1; }
done

# Refuse to run on a PDF inside the repo: it must never live here.
PDF_ABS="$(cd "$(dirname "$PDF")" && pwd)/$(basename "$PDF")"
case "$PDF_ABS" in
  "$ROOT"/*) echo "refusing: the PDF is inside the repo ($PDF_ABS). Keep it outside." >&2; exit 1 ;;
esac

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

# 1. Render pages.
pdftoppm -r "$DPI" -png "$PDF_ABS" "$TMP/raw"

# 2. Locate the phone span on the contact line (the line containing '@').
pdftotext -bbox-layout "$PDF_ABS" "$TMP/bbox.html"
REDACT="$(python3 -I - "$TMP/bbox.html" "$DPI" <<'PY'
import re, sys
html, dpi = open(sys.argv[1], encoding='utf-8').read(), float(sys.argv[2])
scale = dpi / 72.0
page = 0
for page_html in re.split(r'<page ', html)[1:]:
    page += 1
    for line in re.findall(r'<line[^>]*>(.*?)</line>', page_html, re.S):
        words = [(float(a), float(b), float(c), float(d), t) for a, b, c, d, t in
                 re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', line)]
        if not any('@' in w[4] for w in words):
            continue
        bullets = [i for i, w in enumerate(words) if w[4] in ('•', '&#8226;', '|', '·')]
        # The phone sits between the first two separators and is mostly digits.
        if len(bullets) < 2:
            continue
        b0, b1 = bullets[0], bullets[1]
        span = ''.join(w[4] for w in words[b0 + 1:b1])
        if sum(ch.isdigit() for ch in span) < 7:
            continue
        x0 = words[b0][0]          # start of the first separator (removed)
        x1 = words[b1][0]          # start of the second separator (kept, slides left)
        xend = words[-1][2]        # end of the line
        y0 = min(w[1] for w in words); y1 = max(w[3] for w in words)
        pad = 3
        print(page, *(round(v * scale) for v in (x0, x1, xend + pad, y0 - pad, y1 + pad)))
        sys.exit(0)
PY
)" || true

# 3. Redact, watermark, encode.
TILE="$TMP/tile.png"
magick -size 860x420 xc:none -font "$WATERMARK_FONT" -pointsize 44 \
  -fill "rgba(29,35,32,$WATERMARK_OPACITY)" -gravity center \
  -annotate -30x-30+0+0 "$WATERMARK" "$TILE"

PAGES_TS=""
n=0
for raw in $(ls "$TMP"/raw-*.png | sort -V); do
  n=$((n + 1))
  page="$TMP/page-$n.png"
  cp "$raw" "$page"

  if [[ -n "$REDACT" ]]; then
    read -r rp x0 x1 xend y0 y1 <<<"$REDACT"
    if [[ "$rp" == "$n" ]]; then
      # Cut the tail (second separator → end of line), blank from the first
      # separator onwards, then paste the tail where the first separator was.
      w=$((xend - x1)); h=$((y1 - y0))
      magick "$page" -crop "${w}x${h}+${x1}+${y0}" +repage "$TMP/tail.png"
      magick "$page" -fill white -draw "rectangle $x0,$y0 $xend,$y1" \
        "$TMP/tail.png" -geometry "+${x0}+${y0}" -composite "$page"
      echo "page $n: phone redacted"
    fi
  fi

  magick "$page" \( -size "$(magick identify -format '%wx%h' "$page")" "tile:$TILE" \) \
    -composite -strip "$OUT/page-$n.png"
  cwebp -quiet -q 82 "$OUT/page-$n.png" -o "$OUT/page-$n.webp"

  dims="$(magick identify -format '%w %h' "$OUT/page-$n.png")"
  read -r pw ph <<<"$dims"
  PAGES_TS+="  { webp: 'resume/page-$n.webp', png: 'resume/page-$n.png', width: $pw, height: $ph },"$'\n'
done

[[ -z "$REDACT" ]] && echo "warning: no phone number found on the contact line; nothing redacted" >&2

# Remove stale pages from a previous, longer résumé.
for old in "$OUT"/page-*.png; do
  num="${old##*/page-}"; num="${num%.png}"
  if [[ "$num" =~ ^[0-9]+$ && "$num" -gt "$n" ]]; then rm -f "$OUT/page-$num.png" "$OUT/page-$num.webp"; fi
done

# 4. Update the generated block in src/content/resume.ts.
if [[ "$WRITE_CONTENT" == 1 ]]; then
  CONTENT="$ROOT/src/content/resume.ts"
  python3 -I - "$CONTENT" "$PAGES_TS" <<'PY'
import re, sys
path, pages = sys.argv[1], sys.argv[2]
src = open(path, encoding='utf-8').read()
block = "// <generated:resume-pages>\nexport const resumePages: ResumePage[] = [\n" + pages + "]\n// </generated:resume-pages>"
new, count = re.subn(r'// <generated:resume-pages>.*?// </generated:resume-pages>', lambda _: block, src, flags=re.S)
if count != 1:
    sys.exit('generated markers not found in ' + path)
open(path, 'w', encoding='utf-8').write(new)
PY
  echo "updated src/content/resume.ts ($n page(s))"
fi

echo "wrote $n page(s) to $OUT"
