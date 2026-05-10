<script setup lang="ts">
import type { AppItem } from '../lib/apps';
import { getHomebrewLabel, getIconUrl } from '../lib/apps';

defineProps<{
  selectedApps: AppItem[];
  installCommand: string;
  formulaCount: number;
  caskCount: number;
  trustText: string;
}>();

defineEmits<{
  remove: [app: AppItem];
  copyInstallCommand: [];
  copyPreview: [];
  copyShareUrl: [];
  downloadBrewfile: [];
  downloadScript: [];
}>();
</script>

<template>
  <aside class="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow-blue)] backdrop-blur">
    <header class="mb-4 flex items-center justify-between gap-4">
      <h2 class="font-mono text-sm font-semibold uppercase tracking-normal text-terminal-green">
        Selected Apps <span class="ml-1 inline-block h-2 w-2 rounded-full bg-terminal-green"></span>
      </h2>
      <span class="font-mono text-sm text-terminal-green">{{ selectedApps.length }} apps</span>
    </header>

    <div v-if="selectedApps.length" class="max-h-[320px] space-y-1 overflow-auto pr-1">
      <div
        v-for="app in selectedApps"
        :key="app.id"
        class="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-[var(--panel-hover)]"
      >
        <span class="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded bg-[#111827]">
          <picture>
            <source v-if="app.icon.fallbackUrl" :srcset="getIconUrl(app.icon)" type="image/webp" />
            <img
              :src="app.icon.fallbackUrl ?? getIconUrl(app.icon)"
              :alt="`${app.name} icon`"
              class="h-5 w-5 object-contain"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </span>
        <span class="min-w-0 flex-1 truncate font-mono text-sm text-[var(--text)]">{{ app.name }}</span>
        <span class="hidden font-mono text-xs text-[var(--text-muted)] sm:inline">{{ getHomebrewLabel(app) }}</span>
        <button
          type="button"
          class="rounded px-2 py-1 font-mono text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-red-300"
          :aria-label="`Remove ${app.name}`"
          @click="$emit('remove', app)"
        >
          ×
        </button>
      </div>
    </div>

    <div v-else class="rounded-md border border-dashed border-[var(--border)] px-4 py-10 text-center font-mono text-sm text-[var(--text-muted)]">
      No apps selected yet.
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2 border-y border-[var(--border)] py-3">
      <div class="rounded-md border border-[var(--border)] bg-[var(--panel-soft)] p-3">
        <p class="font-mono text-[11px] text-[var(--text-muted)]">Formulae</p>
        <p class="mt-1 font-mono text-sm text-[var(--text)]">{{ formulaCount }}</p>
      </div>
      <div class="rounded-md border border-[var(--border)] bg-[var(--panel-soft)] p-3">
        <p class="font-mono text-[11px] text-[var(--text-muted)]">Casks</p>
        <p class="mt-1 font-mono text-sm text-[var(--text)]">{{ caskCount }}</p>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-terminal-green/80 bg-terminal-green/10 px-5 py-4 font-mono text-lg font-semibold text-terminal-green shadow-[var(--shadow-green)] transition hover:bg-terminal-green/15 disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-[var(--panel-soft)] disabled:text-[var(--text-muted)] disabled:shadow-none"
      :disabled="!selectedApps.length"
      @click="$emit('copyInstallCommand')"
    >
      <span>&gt;_</span>
      Install Selected
    </button>

    <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        type="button"
        class="rounded-md border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text-ink)] transition hover:border-terminal-blue/70 hover:text-terminal-blue disabled:cursor-not-allowed disabled:text-[var(--text-muted)]"
        :disabled="!selectedApps.length"
        @click="$emit('copyPreview')"
      >
        Copy <span class="hidden lg:inline">command</span>
      </button>
      <button
        type="button"
        class="rounded-md border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text-ink)] transition hover:border-terminal-green/70 hover:text-terminal-green disabled:cursor-not-allowed disabled:text-[var(--text-muted)]"
        :disabled="!selectedApps.length"
        @click="$emit('downloadBrewfile')"
      >
        Brewfile
      </button>
      <button
        type="button"
        class="rounded-md border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text-ink)] transition hover:border-terminal-blue/70 hover:text-terminal-blue disabled:cursor-not-allowed disabled:text-[var(--text-muted)]"
        :disabled="!selectedApps.length"
        @click="$emit('downloadScript')"
      >
        Script
      </button>
      <button
        type="button"
        class="rounded-md border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text-ink)] transition hover:border-terminal-green/70 hover:text-terminal-green disabled:cursor-not-allowed disabled:text-[var(--text-muted)]"
        :disabled="!selectedApps.length"
        @click="$emit('copyShareUrl')"
      >
        Share
      </button>
    </div>

    <p class="mt-4 text-center font-mono text-xs leading-5 text-[var(--text-muted)]">
      <span class="block">
        {{ trustText.replace('Homebrew.', '') }}<span class="text-terminal-green">Homebrew</span>.
      </span>
      <a
        href="https://brew.sh/"
        target="_blank"
        rel="noreferrer"
        class="mt-1 inline-block text-terminal-blue underline decoration-terminal-blue/40 underline-offset-4 transition hover:text-terminal-green hover:decoration-terminal-green/70"
      >
        Install Homebrew first
      </a>
    </p>
  </aside>
</template>
