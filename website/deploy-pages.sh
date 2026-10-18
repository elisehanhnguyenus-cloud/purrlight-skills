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

# chỉ đưa lên những file ĐÃ COMMIT trong website/ (git archive), không bao giờ copy file chưa commit hay file
# trong .gitignore — một .env / khoá lỡ để trong website/ sẽ không lên trang công khai (Elise 18/10/2026)
if [ -n "$(git -C "$ROOT" status --porcelain -- website)" ]; then
  echo "Lưu ý: website/ có thay đổi chưa commit — chúng KHÔNG được đưa lên. Commit trước rồi chạy lại nếu cần."
fi
cd "$TMP"
git rm -rq --ignore-unmatch . >/dev/null
git -C "$ROOT" archive HEAD:website | tar -x -C "$TMP"
rm -f README.md deploy-pages.sh
# chặn chót: tên file giống khoá / mật khẩu thì dừng, không đẩy gì cả
BAD="$(find . -path ./.git -prune -o -type f \( -name '.env' -o -name '.env.*' -o -name '*.pem' -o -name '*.key' -o -name '*.p12' -o -name 'id_rsa*' -o -name 'credentials*.json' -o -name '*service-account*.json' -o -name 'client_secret*.json' \) -print)"
if [ -n "$BAD" ]; then
  echo "DỪNG: có file giống khoá bí mật trong website/ — không deploy:"; echo "$BAD"; exit 1
fi
touch .nojekyll            # Pages phục vụ file y nguyên, không chạy Jekyll
git add -A
if git diff --cached --quiet; then
  echo "Không có gì mới để deploy (gh-pages đã khớp website/ @ $SHA)."
  exit 0
fi
git commit -q -m "Deploy website @ $SHA"
git push origin gh-pages
echo "Đã deploy. Chờ 1–2 phút rồi mở: https://elisehanhnguyenus-cloud.github.io/purrlight-skills/"
