<script setup lang="ts">
import type { AppItem } from '../lib/apps';
import { getHomebrewLabel, getHomebrewName } from '../lib/apps';

defineProps<{
  app: AppItem;
  selected: boolean;
}>();

defineEmits<{
  toggle: [app: AppItem];
}>();
</script>

<template>
  <button
    type="button"
    class="group relative flex min-h-[76px] w-full items-center gap-4 overflow-hidden rounded-lg border px-4 text-left transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/80"
    :class="selected
      ? 'border-terminal-green/60 bg-terminal-green/[0.075] shadow-glow'
      : 'border-white/10 bg-white/[0.025] hover:border-terminal-blue/50 hover:bg-terminal-blue/[0.055]'"
    :aria-pressed="selected"
    @click="$emit('toggle', app)"
  >
    <span
      class="grid h-11 w-11 shrink-0 place-items-center rounded-md border font-mono text-2xl transition"
      :class="selected ? 'border-terminal-green/40 bg-terminal-green/10' : 'border-white/10 bg-black/30 group-hover:border-terminal-blue/40'"
    >
      {{ app.icon }}
    </span>

    <span class="min-w-0 flex-1">
      <span class="block truncate font-mono text-[15px] text-white">{{ app.name }}</span>
      <span class="mt-1 block truncate font-mono text-xs text-terminal-muted">
        {{ getHomebrewLabel(app) }} · {{ getHomebrewName(app) }}
      </span>
    </span>

    <span
      class="grid h-6 w-6 shrink-0 place-items-center rounded border font-mono text-sm transition"
      :class="selected
        ? 'border-terminal-green bg-terminal-green/15 text-terminal-green'
        : 'border-white/20 text-transparent group-hover:border-terminal-blue/60'"
      aria-hidden="true"
    >
      ✓
    </span>
  </button>
</template>
