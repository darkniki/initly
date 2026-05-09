export type AppCategory = 'Browsers' | 'Dev Tools' | 'Communication' | 'Productivity' | 'Utilities';
export type HomebrewTargetType = 'formula' | 'cask';

export type AppIcon =
  {
    type: 'url';
    url: string;
    fallbackUrl?: string;
    source: string;
  };

export interface AppItem {
  id: string;
  icon: AppIcon;
  name: string;
  description: string;
  category: AppCategory;
  targets: {
    homebrew: {
      type: HomebrewTargetType;
      name: string;
    };
  };
  verifiedSource: string;
}

export const categories: Array<'All' | AppCategory> = [
  'All',
  'Browsers',
  'Dev Tools',
  'Communication',
  'Productivity',
  'Utilities',
];

const appCategories = categories.filter((category) => category !== 'All') as AppCategory[];
const homebrewTargetTypes: HomebrewTargetType[] = ['formula', 'cask'];
const homebrewPackageNamePattern = /^[a-z0-9][a-z0-9@._+-]*$/;

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

const isNonEmptyString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const requireNonEmptyString = (value: unknown, path: string): string => {
  if (!isNonEmptyString(value)) {
    throw new Error(`${path} must be a non-empty string.`);
  }

  return value as string;
};

const requireHomebrewPackageName = (value: unknown, path: string): string => {
  const packageName = requireNonEmptyString(value, path);

  if (!homebrewPackageNamePattern.test(packageName)) {
    throw new Error(`${path} must be a valid Homebrew package name.`);
  }

  return packageName;
};

export const validateApps = (value: unknown): AppItem[] => {
  if (!Array.isArray(value)) {
    throw new Error('apps.json must export an array.');
  }

  const seenIds = new Set<string>();

  return value.map((app, index) => {
    const prefix = `apps[${index}]`;

    if (!isRecord(app)) {
      throw new Error(`${prefix} must be an object.`);
    }

    const { id, icon, name, description, category, targets, verifiedSource } = app;

    const appId = requireNonEmptyString(id, `${prefix}.id`);
    if (seenIds.has(appId)) throw new Error(`${prefix}.id "${appId}" is duplicated.`);
    seenIds.add(appId);

    if (!isRecord(icon)) throw new Error(`${prefix}.icon must be an object.`);
    if (icon.type !== 'url') throw new Error(`${prefix}.icon.type must be "url".`);
    const iconUrl = requireNonEmptyString(icon.url, `${prefix}.icon.url`);
    const iconFallbackUrl = icon.fallbackUrl === undefined
      ? undefined
      : requireNonEmptyString(icon.fallbackUrl, `${prefix}.icon.fallbackUrl`);
    const iconSource = requireNonEmptyString(icon.source, `${prefix}.icon.source`);

    const appName = requireNonEmptyString(name, `${prefix}.name`);
    const appDescription = requireNonEmptyString(description, `${prefix}.description`);
    if (!appCategories.includes(category as AppCategory)) {
      throw new Error(`${prefix}.category must be one of: ${appCategories.join(', ')}.`);
    }

    if (!isRecord(targets) || !isRecord(targets.homebrew)) {
      throw new Error(`${prefix}.targets.homebrew must be an object.`);
    }

    const homebrewType = targets.homebrew.type;
    const homebrewName = targets.homebrew.name;

    if (!homebrewTargetTypes.includes(homebrewType as HomebrewTargetType)) {
      throw new Error(`${prefix}.targets.homebrew.type must be "formula" or "cask".`);
    }
    const parsedHomebrewName = requireHomebrewPackageName(homebrewName, `${prefix}.targets.homebrew.name`);

    const parsedVerifiedSource = requireNonEmptyString(verifiedSource, `${prefix}.verifiedSource`);

    return {
      id: appId,
      icon: {
        type: 'url',
        url: iconUrl,
        fallbackUrl: iconFallbackUrl,
        source: iconSource,
      },
      name: appName,
      description: appDescription,
      category: category as AppCategory,
      targets: {
        homebrew: {
          type: homebrewType as HomebrewTargetType,
          name: parsedHomebrewName,
        },
      },
      verifiedSource: parsedVerifiedSource,
    };
  });
};

export const getHomebrewLabel = (app: AppItem) => (
  app.targets.homebrew.type === 'cask' ? 'brew cask' : 'brew formula'
);

export const getHomebrewName = (app: AppItem) => app.targets.homebrew.name;

export const getIconUrl = (icon: AppIcon) => icon.url;
