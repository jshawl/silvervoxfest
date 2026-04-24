#!/bin/bash
set -euo pipefail

rm -rf build/*
for plugin in plugins/*; do
    base=$(basename "$plugin")
    file="$plugin/$base.php"
    sha=$(git log --format="%h" -n 1 -- "$plugin")

    old_ver=$(grep -oE '[0-9]+\.[0-9]+' "$file" | head -1)
    new_ver="1.0+$sha"

    echo "Building $base $new_ver"

    # Inject build version
    perl -pi -e "s/Version: $old_ver/Version: $new_ver/" "$file"
    # Zip from plugins/ so paths inside zip are relative to plugin dir
    (cd plugins && zip -r "../build/$base.zip" "$base/includes/" "$base/$base.php" > /dev/null)

    # Restore source version
    perl -pi -e "s/Version: $new_ver/Version: $old_ver/" "$file"
done