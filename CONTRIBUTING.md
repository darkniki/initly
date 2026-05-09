# Contributing to initly.app

initly.app is a command generator for fresh macOS setups. It does not run installs in the background and it should never hide install commands from the user.

## App Data

Applications live in `src/data/apps.json`.

Each entry must use this structure:

```json
{
  "id": "visual-studio-code",
  "icon": "🧩",
  "name": "VS Code",
  "description": "Code editor by Microsoft",
  "category": "Dev Tools",
  "targets": {
    "homebrew": {
      "type": "cask",
      "name": "visual-studio-code"
    }
  },
  "verifiedSource": "Homebrew Cask"
}
```

## Verification Rules

- Verify every Homebrew package on `https://formulae.brew.sh/`.
- Use `type: "formula"` for command-line tools and libraries.
- Use `type: "cask"` for GUI apps.
- Do not guess package names.
- Do not include unofficial taps in the default catalog.
- Keep descriptions short and practical.
- Keep categories limited to: Browsers, Dev Tools, Communication, Productivity, Utilities.

## Output Rules

The UI must always show the generated output before the user copies or downloads it.

Supported outputs:

- install command
- Brewfile
- shell script

The generated shell script must:

- require macOS;
- refuse root execution;
- require Homebrew to already be installed;
- run `brew update`;
- skip packages already installed;
- separate formulae and casks;
- report a summary.
