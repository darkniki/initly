<script setup lang="ts">
import type { AppItem } from '../lib/apps';
import { getHomebrewLabel } from '../lib/apps';

defineProps<{
  selectedApps: AppItem[];
  installCommand: string;
  formulaCount: number;
  caskCount: number;
  trustText: string;
}>();

defineEmits<{
  remove: [app: AppItem];
  copy: [];
  downloadBrewfile: [];
  downloadScript: [];
}>();
</script>

<template>
  <aside class="rounded-lg border border-white/10 bg-black/30 p-4 shadow-blueglow backdrop-blur md:sticky md:top-5">
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
        class="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/[0.045]"
      >
        <span class="grid h-7 w-7 shrink-0 place-items-center rounded bg-white/[0.06] text-base">{{ app.icon }}</span>
        <span class="min-w-0 flex-1 truncate font-mono text-sm text-white">{{ app.name }}</span>
        <span class="hidden font-mono text-xs text-terminal-muted sm:inline">{{ getHomebrewLabel(app) }}</span>
        <button
          type="button"
          class="rounded px-2 py-1 font-mono text-terminal-muted transition hover:bg-red-500/10 hover:text-red-300"
          :aria-label="`Remove ${app.name}`"
          @click="$emit('remove', app)"
        >
          ×
        </button>
      </div>
    </div>

    <div v-else class="rounded-md border border-dashed border-white/15 px-4 py-10 text-center font-mono text-sm text-terminal-muted">
      No apps selected yet.
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2 border-y border-white/10 py-3">
      <div class="rounded-md border border-white/10 bg-white/[0.025] p-3">
        <p class="font-mono text-[11px] text-terminal-muted">Formulae</p>
        <p class="mt-1 font-mono text-sm text-white">{{ formulaCount }}</p>
      </div>
      <div class="rounded-md border border-white/10 bg-white/[0.025] p-3">
        <p class="font-mono text-[11px] text-terminal-muted">Casks</p>
        <p class="mt-1 font-mono text-sm text-white">{{ caskCount }}</p>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-terminal-green/80 bg-terminal-green/10 px-5 py-4 font-mono text-lg font-semibold text-terminal-green shadow-glow transition hover:bg-terminal-green/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.025] disabled:text-terminal-muted disabled:shadow-none"
      :disabled="!selectedApps.length"
      @click="$emit('copy')"
    >
      <span>&gt;_</span>
      Install Selected
    </button>

    <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button
        type="button"
        class="rounded-md border border-white/10 px-3 py-2 font-mono text-xs text-terminal-ink transition hover:border-terminal-blue/70 hover:text-terminal-blue disabled:cursor-not-allowed disabled:text-terminal-muted"
        :disabled="!selectedApps.length"
        @click="$emit('copy')"
      >
        Copy <span class="hidden lg:inline">command</span>
      </button>
      <button
        type="button"
        class="rounded-md border border-white/10 px-3 py-2 font-mono text-xs text-terminal-ink transition hover:border-terminal-green/70 hover:text-terminal-green disabled:cursor-not-allowed disabled:text-terminal-muted"
        :disabled="!selectedApps.length"
        @click="$emit('downloadBrewfile')"
      >
        Brewfile
      </button>
      <button
        type="button"
        class="rounded-md border border-white/10 px-3 py-2 font-mono text-xs text-terminal-ink transition hover:border-terminal-blue/70 hover:text-terminal-blue disabled:cursor-not-allowed disabled:text-terminal-muted"
        :disabled="!selectedApps.length"
        @click="$emit('downloadScript')"
      >
        Script
      </button>
    </div>

    <p class="mt-4 text-center font-mono text-xs text-terminal-muted">
      {{ trustText.replace('Homebrew.', '') }}<span class="text-terminal-green">Homebrew</span>.
    </p>
  </aside>
</template>
