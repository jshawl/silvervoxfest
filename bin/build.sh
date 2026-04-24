#!/bin/bash

rm -rf build/*
for plugin in plugins/*; do
    base=$(basename "$plugin")
    file="$plugin/$base.php"
    sha=$(git log --format="%h" -n 1 -- "$plugin")

    old_ver=$(grep -oE '[0-9]+\.[0-9]+' "$file" | head -1)
    new_ver="1.0+$sha"

    echo "Building $base $new_ver"
    perl -pi -e "s/Version: $old_ver/Version: $new_ver/" "$file"
    echo "Zipping..."
    (cd plugins && zip -r "../build/$base.zip" "$base/includes/" "$base/$base.php" > /dev/null) || true
    echo "Restoring..."
    perl -pi -e "s/Version: \Q$new_ver\E/Version: $old_ver/" "$file"
    echo "Done"
done