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
  appVersion: string;
  repoUrl: string;
}>();

const activeCategory = ref('All');
const query = ref('');
const selected = ref<string[]>(['google-chrome', 'telegram', 'visual-studio-code', 'docker']);
const copied = ref(false);
const copyError = ref('');
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
  copyError.value = '';
  selected.value = [];
};

const markCopied = () => {
  copied.value = true;
  copyError.value = '';
  window.setTimeout(() => {
    copied.value = false;
  }, 1800);
};

const copyWithFallback = async (contents: string) => {
  try {
    await navigator.clipboard.writeText(contents);
    markCopied();
    return;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = contents;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const copiedWithFallback = document.execCommand('copy');
      if (!copiedWithFallback) throw new Error('Copy command was rejected.');
      markCopied();
    } catch {
      copyError.value = 'Copy failed. Select and copy the command manually.';
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

const copyPreview = async () => {
  if (!selectedApps.value.length) return;
  await copyWithFallback(previewContent.value);
};

const copyInstallCommand = async () => {
  if (!selectedApps.value.length) return;
  await copyWithFallback(installCommand.value);
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

};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="initly-shell min-h-screen">
    <header class="border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur">
      <div class="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" class="flex items-center gap-3 font-mono text-2xl font-bold text-terminal-green sm:text-3xl">
          <span class="text-terminal-green">&gt;_</span>
          <span>initly.app</span>
          <span class="hidden rounded border border-terminal-green/25 px-2 py-1 text-xs font-medium text-terminal-green/80 sm:inline">v{{ props.appVersion }}</span>
        </a>
      </div>
    </header>

    <main class="mx-auto grid max-w-[1500px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-8">
      <section id="apps" class="min-w-0">
        <div class="mb-7">
          <h1 class="max-w-3xl font-mono text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
            Select apps.
            <br class="hidden sm:block" />
            Run one command.
          </h1>
          <p class="mt-4 max-w-2xl text-base text-[var(--text-muted)] sm:text-lg">
            Pick your daily Mac apps and generate a Homebrew install command.
          </p>
        </div>

        <label class="relative block max-w-3xl">
          <span class="sr-only">Search apps</span>
          <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg leading-none text-[var(--text-muted)]">⌕</span>
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            placeholder="Search apps... (e.g. docker, figma, slack)"
            class="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] pl-11 pr-4 font-mono text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-terminal-green/70 focus:shadow-glow"
          />
        </label>

        <div id="categories" class="-mx-4 mt-1 flex gap-3 overflow-x-auto px-4 py-6 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-3">
          <div
            v-for="category in categories"
            :key="category"
            class="relative shrink-0"
          >
            <span
              v-if="activeCategory === category"
              class="pointer-events-none absolute -inset-4 hidden rounded-2xl bg-terminal-green/15 blur-xl sm:block"
              aria-hidden="true"
            ></span>
            <button
              type="button"
              class="relative min-w-fit rounded-lg border px-6 py-3 font-mono text-sm transition"
              :class="activeCategory === category
                ? 'border-terminal-green bg-terminal-green/10 text-terminal-green shadow-[0_0_18px_rgba(72,255,106,0.2)]'
                : 'border-[var(--border)] bg-[var(--panel-soft)] text-[var(--text-muted)] hover:border-terminal-blue/60 hover:text-terminal-blue'"
              @click="activeCategory = category"
            >
              {{ category }}
            </button>
          </div>
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

        <p v-if="!filteredApps.length" class="mt-8 rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] p-8 text-center font-mono text-[var(--text-muted)]">
          No apps found.
        </p>
      </section>

      <section id="config" class="space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
        <SelectedApps
          :selected-apps="selectedApps"
          :install-command="installCommand"
          :formula-count="homebrewSplit.formulae.length"
          :cask-count="homebrewSplit.casks.length"
          trust-text="Everything will be installed via Homebrew."
          @remove="toggleApp"
          @copy-install-command="copyInstallCommand"
          @copy-preview="copyPreview"
          @download-brewfile="downloadBrewfile"
          @download-script="downloadScript"
        />

        <TerminalPreview
          :content="previewContent"
          :copied="copied"
          :mode="previewMode"
          @mode-change="previewMode = $event"
          @copy="copyPreview"
        />

        <p v-if="copyError" class="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-200">
          {{ copyError }}
        </p>
      </section>
    </main>

    <footer id="about" class="border-t border-[var(--border)] px-4 py-6 sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-[1500px] flex-col gap-3 text-center font-mono text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <a
          href="https://www.linkedin.com/in/nlaps/"
          class="text-terminal-green transition hover:text-terminal-blue"
          rel="noreferrer"
        >
          &gt;_ Built by Mikita Lapsar
        </a>
        <span>Your Mac. Your setup. One command away.</span>
        <a :href="props.repoUrl" class="inline-flex items-center justify-center gap-2 text-terminal-green transition hover:text-terminal-blue" rel="noreferrer">
          <svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.03c-3.2.7-3.88-1.37-3.88-1.37-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18A10.9 10.9 0 0 1 12 6.14c.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.15c0 .31.21.67.79.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
          <span>Open source on GitHub</span>
        </a>
      </div>
    </footer>
  </div>
</template>
