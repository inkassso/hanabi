#!/bin/bash

echo "Running in $PWD"

folder="node_modules/@forevolve/bootstrap-dark/scss"
find "$folder" -type f -name "*.scss" | while read file; do
  echo "Replacing in file $file"
  sed -i 's/node_modules\//~/g' "$file"
done
