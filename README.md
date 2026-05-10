# initly.app

Select the Mac apps you use every day and generate one Homebrew install command.

initly.app is a static, open-source app picker for fresh macOS setups. It runs entirely in the browser: no backend, no analytics, and no hidden installs.

## Features

- Search and filter common Mac apps
- Select GUI apps and CLI tools
- Generate a Homebrew install command
- Export a Brewfile or shell script
- Share a preselected app list with `?apps=chrome,docker,vscode`
- Generate optional macOS defaults and terminal setup scripts
- Persist selected apps locally in the browser
- Validate app catalog data at build time

## Stack

- Astro
- Vue 3 islands
- TypeScript
- Tailwind CSS
- Static JSON app catalog

## Local Development

```bash
npm install
npm run dev
```

Build and preview the static output:

```bash
npm run build
npm run preview
```

## App Catalog

Apps live in `src/data/apps.json`.

Homebrew package names are validated during the Astro build. Package names must use safe Homebrew tokens so generated commands cannot include shell operators.

## Deployment

The project builds to `dist/` and can be deployed to any static host.

For Cloudflare Pages Direct Upload:

```bash
npm run build
```

Then upload the `dist/` directory.

## License

MIT
