<script setup lang="ts">
import type { SetupOption } from '../lib/setup';

defineProps<{
  selectedOptions: SetupOption[];
}>();

defineEmits<{
  remove: [option: SetupOption];
  copySetupScript: [];
  downloadSetupScript: [];
}>();
</script>

<template>
  <aside class="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow-blue)] backdrop-blur">
    <header class="mb-4 flex items-center justify-between gap-4">
      <h2 class="font-mono text-sm font-semibold uppercase tracking-normal text-terminal-green">
        Selected Setup <span class="ml-1 inline-block h-2 w-2 rounded-full bg-terminal-green"></span>
      </h2>
      <span class="font-mono text-sm text-terminal-green">{{ selectedOptions.length }} items</span>
    </header>

    <div v-if="selectedOptions.length" class="max-h-[300px] space-y-1 overflow-auto pr-1">
      <div
        v-for="option in selectedOptions"
        :key="option.id"
        class="flex items-start gap-3 rounded-md px-2 py-2 transition hover:bg-[var(--panel-hover)]"
      >
        <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-terminal-green shadow-[0_0_10px_rgba(72,255,106,0.65)]"></span>
        <span class="min-w-0 flex-1">
          <span class="block truncate font-mono text-sm text-[var(--text)]">{{ option.title }}</span>
          <span class="mt-1 block text-xs leading-4 text-[var(--text-muted)]">{{ option.description }}</span>
        </span>
        <button
          type="button"
          class="rounded px-2 py-1 font-mono text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-red-300"
          :aria-label="`Remove ${option.title}`"
          @click="$emit('remove', option)"
        >
          ×
        </button>
      </div>
    </div>

    <div v-else class="rounded-md border border-dashed border-[var(--border)] px-4 py-10 text-center font-mono text-sm text-[var(--text-muted)]">
      No setup options selected yet.
    </div>

    <button
      type="button"
      class="mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-terminal-green/80 bg-terminal-green/10 px-5 py-4 font-mono text-lg font-semibold text-terminal-green shadow-[var(--shadow-green)] transition hover:bg-terminal-green/15 disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-[var(--panel-soft)] disabled:text-[var(--text-muted)] disabled:shadow-none"
      :disabled="!selectedOptions.length"
      @click="$emit('copySetupScript')"
    >
      <span>&gt;_</span>
      Copy Setup Script
    </button>

    <div class="mt-3 grid grid-cols-2 gap-2">
      <button
        type="button"
        class="rounded-md border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text-ink)] transition hover:border-terminal-blue/70 hover:text-terminal-blue disabled:cursor-not-allowed disabled:text-[var(--text-muted)]"
        :disabled="!selectedOptions.length"
        @click="$emit('copySetupScript')"
      >
        Copy script
      </button>
      <button
        type="button"
        class="rounded-md border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text-ink)] transition hover:border-terminal-green/70 hover:text-terminal-green disabled:cursor-not-allowed disabled:text-[var(--text-muted)]"
        :disabled="!selectedOptions.length"
        @click="$emit('downloadSetupScript')"
      >
        Download
      </button>
    </div>

    <p class="mt-4 text-center font-mono text-xs leading-5 text-[var(--text-muted)]">
      Nothing runs automatically. Copy, review, then execute only what you trust.
    </p>
  </aside>
</template>
