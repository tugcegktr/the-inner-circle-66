#!/usr/bin/env bash
set -e

# Design constants (relative to viewport 108x108 from the XML):
# Ring: center=54, radius=26 (ratio: 26/108=0.2407), strokeWidth=2.5 (ratio: 2.5/108=0.02315)
# Diamond: half-diagonal=7 (ratio: 7/108=0.06481)
# Background: #0D0D0D, Gold: #C9A84C

RING_RATIO="0.2407"
STROKE_RATIO="0.02315"
DIAMOND_RATIO="0.06481"
BG="#0D0D0D"
GOLD="#C9A84C"

BASE="android/app/src/main/res"

generate_icon() {
  local SIZE=$1
  local OUT=$2
  local ROUND=$3

  local CX=$((SIZE / 2))
  local CY=$((SIZE / 2))
  # Ring radius in pixels
  local R=$(echo "$SIZE $RING_RATIO" | awk '{printf "%d", $1 * $2 + 0.5}')
  # Stroke width in pixels (min 1)
  local SW=$(echo "$SIZE $STROKE_RATIO" | awk '{v = $1 * $2 + 0.5; printf "%d", (v < 1.5 ? 1.5 : v)}')
  # Diamond half-diagonal in pixels (min 2)
  local D=$(echo "$SIZE $DIAMOND_RATIO" | awk '{v = $1 * $2 + 0.5; printf "%d", (v < 2 ? 2 : v)}')

  local TOP=$((CY - D))
  local BOT=$((CY + D))
  local LEFT=$((CX - D))
  local RIGHT=$((CX + D))

  # Circle ring point: (CX+R, CY) for the radius endpoint
  local RX=$((CX + R))

  if [ "$ROUND" = "1" ]; then
    # Generate square first, then clip to circle
    magick -size "${SIZE}x${SIZE}" xc:"$BG" \
      -fill none -stroke "$GOLD" -strokewidth "$SW" \
      -draw "circle $CX,$CY $RX,$CY" \
      -fill "$GOLD" -stroke none \
      -draw "polygon $CX,$TOP $RIGHT,$CY $CX,$BOT $LEFT,$CY" \
      \( +clone -threshold 101% -fill white \
         -draw "circle $CX,$CY $((SIZE-1)),$CY" \) \
      -compose DstIn -composite \
      "$OUT"
  else
    magick -size "${SIZE}x${SIZE}" xc:"$BG" \
      -fill none -stroke "$GOLD" -strokewidth "$SW" \
      -draw "circle $CX,$CY $RX,$CY" \
      -fill "$GOLD" -stroke none \
      -draw "polygon $CX,$TOP $RIGHT,$CY $CX,$BOT $LEFT,$CY" \
      "$OUT"
  fi
}

generate_foreground() {
  local SIZE=$1
  local OUT=$2

  local CX=$((SIZE / 2))
  local CY=$((SIZE / 2))
  local R=$(echo "$SIZE $RING_RATIO" | awk '{printf "%d", $1 * $2 + 0.5}')
  local SW=$(echo "$SIZE $STROKE_RATIO" | awk '{v = $1 * $2 + 0.5; printf "%d", (v < 1.5 ? 1.5 : v)}')
  local D=$(echo "$SIZE $DIAMOND_RATIO" | awk '{v = $1 * $2 + 0.5; printf "%d", (v < 2 ? 2 : v)}')

  local TOP=$((CY - D))
  local BOT=$((CY + D))
  local LEFT=$((CX - D))
  local RIGHT=$((CX + D))
  local RX=$((CX + R))

  # Transparent background foreground
  magick -size "${SIZE}x${SIZE}" xc:none \
    -fill none -stroke "$GOLD" -strokewidth "$SW" \
    -draw "circle $CX,$CY $RX,$CY" \
    -fill "$GOLD" -stroke none \
    -draw "polygon $CX,$TOP $RIGHT,$CY $CX,$BOT $LEFT,$CY" \
    "$OUT"
}

echo "Generating mdpi (48x48, foreground 108x108)..."
generate_icon 48  "$BASE/mipmap-mdpi/ic_launcher.png"       0
generate_icon 48  "$BASE/mipmap-mdpi/ic_launcher_round.png" 1
generate_foreground 108 "$BASE/mipmap-mdpi/ic_launcher_foreground.png"

echo "Generating hdpi (72x72, foreground 162x162)..."
generate_icon 72  "$BASE/mipmap-hdpi/ic_launcher.png"       0
generate_icon 72  "$BASE/mipmap-hdpi/ic_launcher_round.png" 1
generate_foreground 162 "$BASE/mipmap-hdpi/ic_launcher_foreground.png"

echo "Generating xhdpi (96x96, foreground 216x216)..."
generate_icon 96  "$BASE/mipmap-xhdpi/ic_launcher.png"       0
generate_icon 96  "$BASE/mipmap-xhdpi/ic_launcher_round.png" 1
generate_foreground 216 "$BASE/mipmap-xhdpi/ic_launcher_foreground.png"

echo "Generating xxhdpi (144x144, foreground 324x324)..."
generate_icon 144 "$BASE/mipmap-xxhdpi/ic_launcher.png"       0
generate_icon 144 "$BASE/mipmap-xxhdpi/ic_launcher_round.png" 1
generate_foreground 324 "$BASE/mipmap-xxhdpi/ic_launcher_foreground.png"

echo "Generating xxxhdpi (192x192, foreground 432x432)..."
generate_icon 192 "$BASE/mipmap-xxxhdpi/ic_launcher.png"       0
generate_icon 192 "$BASE/mipmap-xxxhdpi/ic_launcher_round.png" 1
generate_foreground 432 "$BASE/mipmap-xxxhdpi/ic_launcher_foreground.png"

echo "All icons generated."
