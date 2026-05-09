<script setup lang="ts">
import type { AppItem } from '../lib/apps';
import { getHomebrewLabel, getHomebrewName, getIconUrl } from '../lib/apps';

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
      ? 'border-[var(--border-strong)] bg-[var(--selected)] shadow-[var(--shadow-green)]'
      : 'border-[var(--border)] bg-[var(--panel-soft)] hover:border-terminal-blue/50 hover:bg-[var(--panel-hover)]'"
    :aria-pressed="selected"
    @click="$emit('toggle', app)"
  >
    <span
      class="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-md border bg-[#111827] transition"
      :class="selected ? 'border-terminal-green/40 shadow-[0_0_16px_rgba(72,255,106,0.18)]' : 'border-[var(--border)] group-hover:border-terminal-blue/40'"
    >
        <picture>
          <source v-if="app.icon.fallbackUrl" :srcset="getIconUrl(app.icon)" type="image/webp" />
          <img
            :src="app.icon.fallbackUrl ?? getIconUrl(app.icon)"
            :alt="`${app.name} icon`"
            class="h-7 w-7 object-contain"
            loading="lazy"
            decoding="async"
          />
        </picture>
    </span>

    <span class="min-w-0 flex-1">
      <span class="block truncate font-mono text-[15px] text-[var(--text)]">{{ app.name }}</span>
      <span class="mt-1 block truncate font-mono text-xs text-[var(--text-muted)]">
        {{ getHomebrewLabel(app) }} · {{ getHomebrewName(app) }}
      </span>
    </span>

    <span
      class="grid h-6 w-6 shrink-0 place-items-center rounded border font-mono text-[10px] font-bold transition"
      :class="selected
        ? 'border-terminal-green bg-terminal-green/20 text-terminal-green shadow-[inset_0_0_0_1px_rgba(5,8,9,0.72),0_0_12px_rgba(72,255,106,0.28)]'
        : 'border-[var(--border)] bg-black/20 text-transparent group-hover:border-terminal-blue/60 group-hover:bg-terminal-blue/5'"
      aria-hidden="true"
    >
      <span
        class="block h-3.5 w-3.5 rounded-[3px] transition"
        :class="selected ? 'bg-terminal-green/85 shadow-[0_0_8px_rgba(72,255,106,0.45)]' : 'bg-transparent'"
      ></span>
    </span>
  </button>
</template>
