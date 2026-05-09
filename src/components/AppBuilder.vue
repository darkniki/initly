<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import AppCard from './AppCard.vue';
import SelectedApps from './SelectedApps.vue';
import TerminalPreview, { type PreviewMode } from './TerminalPreview.vue';
import type { AppItem } from '../lib/apps';
import { categories, getHomebrewName } from '../lib/apps';
import {
  generateBrewfile,
  generateHomebrewScript,
  generateInstallCommand,
  splitHomebrewTargets,
} from '../lib/homebrew';

const props = defineProps<{
  apps: AppItem[];
}>();

const activeCategory = ref('All');
const query = ref('');
const selected = ref<string[]>(['google-chrome', 'telegram', 'visual-studio-code', 'docker']);
const copied = ref(false);
const previewMode = ref<PreviewMode>('command');
const searchInput = ref<HTMLInputElement | null>(null);

const filteredApps = computed(() => {
  const search = query.value.trim().toLowerCase();

  return props.apps.filter((app) => {
    const matchesCategory = activeCategory.value === 'All' || app.category === activeCategory.value;
    const matchesSearch = !search
      || app.name.toLowerCase().includes(search)
      || app.description.toLowerCase().includes(search)
      || app.category.toLowerCase().includes(search)
      || getHomebrewName(app).toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });
});

const selectedApps = computed(() => {
  const selectedSet = new Set(selected.value);
  return props.apps.filter((app) => selectedSet.has(app.id));
});

const installCommand = computed(() => generateInstallCommand(selectedApps.value));
const brewfile = computed(() => generateBrewfile(selectedApps.value));
const installScript = computed(() => generateHomebrewScript(selectedApps.value));
const homebrewSplit = computed(() => splitHomebrewTargets(selectedApps.value));

const previewContent = computed(() => {
  if (previewMode.value === 'brewfile') {
    return brewfile.value || '# Select apps to generate a Brewfile';
  }

  if (previewMode.value === 'script') {
    return installScript.value;
  }

  return installCommand.value;
});

const toggleApp = (app: AppItem) => {
  copied.value = false;
  selected.value = selected.value.includes(app.id)
    ? selected.value.filter((id) => id !== app.id)
    : [...selected.value, app.id];
};

const isSelected = (app: AppItem) => selected.value.includes(app.id);

const clearSelected = () => {
  copied.value = false;
  selected.value = [];
};

const copyCommand = async () => {
  if (!selectedApps.value.length) return;

  await navigator.clipboard.writeText(previewContent.value);
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1800);
};

const downloadTextFile = (contents: string, filename: string) => {
  const blob = new Blob([`${contents.trimEnd()}\n`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadBrewfile = () => {
  if (!selectedApps.value.length) return;
  downloadTextFile(brewfile.value, 'Brewfile');
};

const downloadScript = () => {
  if (!selectedApps.value.length) return;
  downloadTextFile(installScript.value, 'initly-install.sh');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (event.metaKey || event.ctrlKey || event.altKey) return;

  if (event.key === '/') {
    event.preventDefault();
    searchInput.value?.focus();
    return;
  }

  if (event.key === 'y') {
    event.preventDefault();
    void copyCommand();
    return;
  }

  if (event.key === 'd') {
    event.preventDefault();
    previewMode.value === 'script' ? downloadScript() : downloadBrewfile();
    return;
  }

  if (event.key === 'c') {
    event.preventDefault();
    clearSelected();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b border-white/10 bg-black/30 backdrop-blur">
      <div class="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" class="flex items-center gap-3 font-mono text-2xl font-bold text-terminal-green sm:text-3xl">
          <span class="text-terminal-green">&gt;_</span>
          <span>initly.app</span>
          <span class="hidden rounded border border-terminal-green/25 px-2 py-1 text-xs font-medium text-terminal-green/80 sm:inline">v0.1.0</span>
        </a>

        <nav class="hidden items-center gap-8 font-mono text-sm text-terminal-muted md:flex">
          <a class="text-terminal-green" href="#apps">Apps</a>
          <a class="transition hover:text-terminal-green" href="#categories">Categories</a>
          <a class="transition hover:text-terminal-green" href="#config">Config</a>
          <a class="transition hover:text-terminal-green" href="#about">About</a>
          <a class="transition hover:text-terminal-green" href="https://github.com/" rel="noreferrer">GitHub</a>
          <a class="rounded-md border border-terminal-green/30 px-4 py-2 text-terminal-green transition hover:bg-terminal-green/10" href="#docs">&gt;_ Docs</a>
        </nav>

        <a class="rounded-md border border-terminal-green/30 px-3 py-2 font-mono text-sm text-terminal-green md:hidden" href="#docs">Docs</a>
      </div>
    </header>

    <main class="mx-auto grid max-w-[1500px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-8">
      <section id="apps" class="min-w-0">
        <div class="mb-7">
          <p class="mb-3 font-mono text-sm font-semibold uppercase text-terminal-green">&gt; Step 1 of 3</p>
          <h1 class="max-w-4xl font-mono text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Select apps for your fresh Mac
          </h1>
          <p class="mt-4 max-w-3xl text-base text-terminal-muted sm:text-lg">
            Choose the apps you use every day. We'll install them all in one go.
          </p>
        </div>

        <label class="relative block max-w-3xl">
          <span class="sr-only">Search apps</span>
          <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-terminal-muted">⌕</span>
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            placeholder="Search apps... (e.g. docker, figma, slack)"
            class="h-12 w-full rounded-lg border border-white/10 bg-black/30 pl-12 pr-4 font-mono text-sm text-white outline-none transition placeholder:text-terminal-muted focus:border-terminal-green/70 focus:shadow-glow"
          />
        </label>

        <div id="categories" class="mt-5 flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="min-w-fit rounded-lg border px-6 py-3 font-mono text-sm transition"
            :class="activeCategory === category
              ? 'border-terminal-green bg-terminal-green/10 text-terminal-green shadow-glow'
              : 'border-white/10 bg-white/[0.025] text-terminal-muted hover:border-terminal-blue/60 hover:text-terminal-blue'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <AppCard
            v-for="app in filteredApps"
            :key="app.id"
            :app="app"
            :selected="isSelected(app)"
            @toggle="toggleApp"
          />
        </div>

        <p v-if="!filteredApps.length" class="mt-8 rounded-lg border border-white/10 bg-white/[0.025] p-8 text-center font-mono text-terminal-muted">
          No apps found.
        </p>
      </section>

      <section id="config" class="space-y-4">
        <SelectedApps
          :selected-apps="selectedApps"
          :install-command="installCommand"
          :formula-count="homebrewSplit.formulae.length"
          :cask-count="homebrewSplit.casks.length"
          trust-text="Everything will be installed via Homebrew."
          @remove="toggleApp"
          @copy="copyCommand"
          @download-brewfile="downloadBrewfile"
          @download-script="downloadScript"
        />

        <TerminalPreview
          :content="previewContent"
          :copied="copied"
          :mode="previewMode"
          @mode-change="previewMode = $event"
        />

        <div class="rounded-lg border border-white/10 bg-white/[0.025] p-4 font-mono text-xs text-terminal-muted">
          <p class="text-terminal-green">Shortcuts</p>
          <p class="mt-2">/ search · y copy visible preview · d download Brewfile/script · c clear selection</p>
        </div>
      </section>
    </main>

    <footer id="about" class="border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-[1500px] flex-col gap-3 text-center font-mono text-xs text-terminal-muted sm:flex-row sm:items-center sm:justify-between">
        <span class="text-terminal-green">&gt;_ <span class="text-terminal-muted">Made with coffee and caffeine.</span></span>
        <span>Your Mac. Your setup. One command away.</span>
        <a href="https://github.com/" class="text-terminal-green transition hover:text-terminal-blue" rel="noreferrer">Open source on GitHub</a>
      </div>
    </footer>
  </div>
</template>
