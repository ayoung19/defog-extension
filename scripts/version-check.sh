#!/bin/bash
set -e

CURRENT_VERSION=$(jq -r '.version' package.json)
NEW_VERSION="$VERSION"

if ! echo "$CURRENT_VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Error: Current version '$CURRENT_VERSION' is not valid semver"
  exit 1
fi

if ! echo "$NEW_VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Error: New version '$NEW_VERSION' is not valid semver"
  exit 1
fi

IFS='.' read -ra CURR <<< "$CURRENT_VERSION"
IFS='.' read -ra NEW <<< "$NEW_VERSION"

for i in "${!NEW[@]}"; do
  if (( NEW[i] < CURR[i] )); then
    echo "Error: New version $NEW_VERSION is less than current version $CURRENT_VERSION"
    exit 1
  elif (( NEW[i] > CURR[i] )); then
    exit 0
  fi
done

echo "Error: New version $NEW_VERSION is equal to current version $CURRENT_VERSION"
exit 1
