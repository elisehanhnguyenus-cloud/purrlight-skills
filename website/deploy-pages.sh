#!/usr/bin/env bash
# Đẩy thư mục website/ lên GitHub Pages (branch gh-pages).
# Chạy từ bất kỳ đâu trong repo:  bash website/deploy-pages.sh
# Cần: git đã đăng nhập (push được lên origin). Không cần Node, không build.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
SRC="$ROOT/website"
SHA="$(git -C "$ROOT" rev-parse --short HEAD)"
TMP="$(mktemp -d)"
cleanup() { git -C "$ROOT" worktree remove --force "$TMP" 2>/dev/null || true; rm -rf "$TMP"; }
trap cleanup EXIT

# lấy gh-pages mới nhất (tạo branch local nếu chưa có)
git -C "$ROOT" fetch origin gh-pages
git -C "$ROOT" branch -f gh-pages origin/gh-pages 2>/dev/null || true
git -C "$ROOT" worktree add "$TMP" gh-pages

# thay toàn bộ nội dung bằng bản copy của website/ (trừ file nội bộ)
cd "$TMP"
git rm -rq --ignore-unmatch . >/dev/null
cp -R "$SRC"/. .
rm -f README.md deploy-pages.sh
touch .nojekyll            # Pages phục vụ file y nguyên, không chạy Jekyll
git add -A
if git diff --cached --quiet; then
  echo "Không có gì mới để deploy (gh-pages đã khớp website/ @ $SHA)."
  exit 0
fi
git commit -q -m "Deploy website @ $SHA"
git push origin gh-pages
echo "Đã deploy. Chờ 1–2 phút rồi mở: https://elisehanhnguyenus-cloud.github.io/purrlight-skills/"
