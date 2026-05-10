<script setup lang="ts">
import type { SetupOption } from '../lib/setup';

defineProps<{
  option: SetupOption;
  selected: boolean;
}>();

defineEmits<{
  toggle: [option: SetupOption];
}>();
</script>

<template>
  <button
    type="button"
    class="group relative flex min-h-[92px] w-full items-start gap-4 overflow-hidden rounded-lg border p-4 text-left transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/80"
    :class="selected
      ? 'border-[var(--border-strong)] bg-[var(--selected)] shadow-[var(--shadow-green)]'
      : 'border-[var(--border)] bg-[var(--panel-soft)] hover:border-terminal-blue/50 hover:bg-[var(--panel-hover)]'"
    :aria-pressed="selected"
    @click="$emit('toggle', option)"
  >
    <span
      class="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded border font-mono text-[10px] font-bold transition"
      :class="selected
        ? 'border-terminal-green bg-terminal-green/20 text-terminal-green shadow-[inset_0_0_0_1px_rgba(5,8,9,0.72),0_0_12px_rgba(72,255,106,0.28)]'
        : 'border-[var(--border)] bg-black/20 text-transparent group-hover:border-terminal-blue/60 group-hover:bg-terminal-blue/5'"
      aria-hidden="true"
    >
      <span
        class="block h-4 w-4 rounded-[3px] transition"
        :class="selected ? 'bg-terminal-green/85 shadow-[0_0_8px_rgba(72,255,106,0.45)]' : 'bg-transparent'"
      ></span>
    </span>

    <span class="min-w-0">
      <span class="block font-mono text-[15px] text-[var(--text)]">{{ option.title }}</span>
      <span class="mt-1 block text-sm leading-5 text-[var(--text-muted)]">{{ option.description }}</span>
    </span>
  </button>
</template>
