export type SetupCategory = 'macos' | 'terminal';

export interface SetupGroup {
  id: SetupCategory;
  title: string;
  description: string;
}

export interface SetupOption {
  id: string;
  category: SetupCategory;
  title: string;
  description: string;
  commands: string[];
  requiresHomebrew?: boolean;
}

export const setupGroups: SetupGroup[] = [
  {
    id: 'macos',
    title: 'macOS defaults',
    description: 'Common Finder, keyboard, and desktop defaults for a fresh Mac.',
  },
  {
    id: 'terminal',
    title: 'Terminal setup',
    description: 'Shell tools and prompt setup that stay visible before you run them.',
  },
];

export const setupOptions: SetupOption[] = [
  {
    id: 'finder-show-hidden-files',
    category: 'macos',
    title: 'Show hidden files',
    description: 'Make dotfiles visible in Finder.',
    commands: [
      'defaults write com.apple.finder AppleShowAllFiles -bool true',
      'killall Finder || true',
    ],
  },
  {
    id: 'finder-path-status-bars',
    category: 'macos',
    title: 'Finder path and status bars',
    description: 'Show the path bar and status bar in Finder windows.',
    commands: [
      'defaults write com.apple.finder ShowPathbar -bool true',
      'defaults write com.apple.finder ShowStatusBar -bool true',
      'killall Finder || true',
    ],
  },
  {
    id: 'keyboard-fast-repeat',
    category: 'macos',
    title: 'Fast key repeat',
    description: 'Use faster key repeat and shorter initial delay.',
    commands: [
      'defaults write NSGlobalDomain KeyRepeat -int 2',
      'defaults write NSGlobalDomain InitialKeyRepeat -int 15',
    ],
  },
  {
    id: 'keyboard-disable-press-hold',
    category: 'macos',
    title: 'Disable press-and-hold',
    description: 'Make held keys repeat instead of opening the accent picker.',
    commands: [
      'defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool false',
    ],
  },
  {
    id: 'desktop-no-dsstore',
    category: 'macos',
    title: 'Skip .DS_Store on external volumes',
    description: 'Avoid writing .DS_Store files on network and USB drives.',
    commands: [
      'defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true',
      'defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true',
    ],
  },
  {
    id: 'terminal-jetbrains-nerd-font',
    category: 'terminal',
    title: 'JetBrains Mono Nerd Font',
    description: 'Install a patched monospace font for terminal icons.',
    requiresHomebrew: true,
    commands: [
      'brew install --cask font-jetbrains-mono-nerd-font',
    ],
  },
  {
    id: 'terminal-starship',
    category: 'terminal',
    title: 'Starship prompt',
    description: 'Install Starship and load it from ~/.zshrc.',
    requiresHomebrew: true,
    commands: [
      'brew install starship',
      'grep -qxF \'eval "$(starship init zsh)"\' "$HOME/.zshrc" || echo \'eval "$(starship init zsh)"\' >> "$HOME/.zshrc"',
    ],
  },
  {
    id: 'terminal-zsh-autosuggestions',
    category: 'terminal',
    title: 'zsh autosuggestions',
    description: 'Install command suggestions and load them from ~/.zshrc.',
    requiresHomebrew: true,
    commands: [
      'brew install zsh-autosuggestions',
      'grep -qxF \'source "$(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh"\' "$HOME/.zshrc" || echo \'source "$(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh"\' >> "$HOME/.zshrc"',
    ],
  },
  {
    id: 'terminal-oh-my-zsh',
    category: 'terminal',
    title: 'Oh My Zsh',
    description: 'Install Oh My Zsh with its official install script.',
    commands: [
      'if [ ! -d "$HOME/.oh-my-zsh" ]; then',
      '  RUNZSH=no CHSH=no KEEP_ZSHRC=yes sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
      'else',
      '  echo "Oh My Zsh already installed"',
      'fi',
    ],
  },
];

export const generateSetupScript = (options: SetupOption[]) => {
  if (!options.length) {
    return '# Select setup options to generate a setup script';
  }

  const lines = [
    '#!/bin/bash',
    'set -euo pipefail',
    '',
    'if [ "$(uname)" != "Darwin" ]; then',
    '  echo "This setup script is intended for macOS."',
    '  exit 1',
    'fi',
  ];

  if (options.some((option) => option.requiresHomebrew)) {
    lines.push(
      '',
      'if ! command -v brew >/dev/null 2>&1; then',
      '  echo "Homebrew is required for selected terminal tools: https://brew.sh/"',
      '  exit 1',
      'fi',
    );
  }

  lines.push('', 'echo ":: Applying initly.app setup"');

  options.forEach((option) => {
    lines.push('', `# ${option.title}`, ...option.commands);
  });

  lines.push('', 'echo ":: Done. Restart affected apps to apply every change."');

  return lines.join('\n');
};
