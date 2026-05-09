export type AppCategory = 'Browsers' | 'Dev Tools' | 'Communication' | 'Productivity' | 'Utilities';
export type HomebrewTargetType = 'formula' | 'cask';

export interface AppItem {
  id: string;
  icon: string;
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

export const getHomebrewLabel = (app: AppItem) => (
  app.targets.homebrew.type === 'cask' ? 'brew cask' : 'brew formula'
);

export const getHomebrewName = (app: AppItem) => app.targets.homebrew.name;
