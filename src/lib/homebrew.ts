import type { AppItem } from './apps';
import { getHomebrewName } from './apps';

const escapeDoubleQuoted = (value: string) => value
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"')
  .replace(/\$/g, '\\$')
  .replace(/`/g, '\\`');

const escapeBrewfileString = (value: string) => value
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"');

export const splitHomebrewTargets = (apps: AppItem[]) => ({
  formulae: apps.filter((app) => app.targets.homebrew.type === 'formula'),
  casks: apps.filter((app) => app.targets.homebrew.type === 'cask'),
});

export const generateInstallCommand = (apps: AppItem[]) => {
  if (!apps.length) {
    return 'brew update\n# Select apps to generate your install command';
  }

  const { formulae, casks } = splitHomebrewTargets(apps);
  const lines = ['brew update'];

  if (formulae.length) {
    lines.push(`brew install ${formulae.map(getHomebrewName).join(' ')}`);
  }

  if (casks.length) {
    lines.push(`brew install --cask ${casks.map(getHomebrewName).join(' ')}`);
  }

  return lines.join('\n');
};

export const generateBrewfile = (apps: AppItem[]) => apps
  .map((app) => {
    const name = escapeBrewfileString(getHomebrewName(app));
    return app.targets.homebrew.type === 'formula' ? `brew "${name}"` : `cask "${name}"`;
  })
  .join('\n');

export const generateHomebrewScript = (apps: AppItem[]) => {
  if (!apps.length) {
    return '#!/bin/bash\nset -euo pipefail\n\necho "No apps selected."\n';
  }

  const installLines = apps.map((app) => {
    const name = escapeDoubleQuoted(app.name);
    const packageName = escapeDoubleQuoted(getHomebrewName(app));
    return `install_package "${name}" "${packageName}" "${app.targets.homebrew.type}"`;
  }).join('\n');

  return `#!/bin/bash
set -euo pipefail

if [[ "\${OSTYPE:-}" != darwin* ]]; then
  echo "initly.app is designed for macOS Homebrew installs."
  exit 1
fi

if [[ "\${EUID:-$(id -u)}" -eq 0 ]]; then
  echo "Do not run Homebrew as root."
  exit 1
fi

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew is not installed. Install it from https://brew.sh first."
  exit 1
fi

installed=0
skipped=0
failed=0

with_retry() {
  local attempt=1
  local max=3
  local delay=3

  until "$@"; do
    if [[ "$attempt" -ge "$max" ]]; then
      return 1
    fi

    echo "Retrying in \${delay}s: $*"
    sleep "$delay"
    attempt=$((attempt + 1))
    delay=$((delay * 2))
  done
}

is_installed() {
  local package_name="$1"
  local package_type="$2"

  if [[ "$package_type" == "cask" ]]; then
    brew list --cask 2>/dev/null | grep -Fxq "$package_name"
  else
    brew list --formula 2>/dev/null | grep -Fxq "$package_name"
  fi
}

install_package() {
  local display_name="$1"
  local package_name="$2"
  local package_type="$3"

  if is_installed "$package_name" "$package_type"; then
    echo "[-] $display_name already installed"
    skipped=$((skipped + 1))
    return 0
  fi

  echo "[+] Installing $display_name"

  if [[ "$package_type" == "cask" ]]; then
    if with_retry brew install --cask "$package_name"; then
      installed=$((installed + 1))
    else
      failed=$((failed + 1))
    fi
  else
    if with_retry brew install "$package_name"; then
      installed=$((installed + 1))
    else
      failed=$((failed + 1))
    fi
  fi
}

echo ":: Updating Homebrew"
brew update

${installLines}

echo
echo ":: Summary: \${installed} installed, \${skipped} skipped, \${failed} failed"

if [[ "$failed" -gt 0 ]]; then
  exit 1
fi
`;
};
