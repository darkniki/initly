<script setup lang="ts">
export type PreviewMode = 'command' | 'brewfile' | 'script';

defineProps<{
  content: string;
  copied: boolean;
  mode: PreviewMode;
}>();

defineEmits<{
  modeChange: [mode: PreviewMode];
  copy: [];
}>();

const modes: Array<{ id: PreviewMode; label: string }> = [
  { id: 'command', label: 'Command' },
  { id: 'brewfile', label: 'Brewfile' },
  { id: 'script', label: 'Script' },
];
</script>

<template>
  <section class="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 backdrop-blur">
    <header class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="whitespace-nowrap font-mono text-sm font-semibold uppercase tracking-normal text-terminal-green">
          Terminal Preview
        </h2>
        <span class="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
          <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-terminal-green shadow-[0_0_14px_rgba(72,255,106,0.75)]"></span>
          {{ copied ? 'Copied' : 'Live' }}
        </span>
      </div>

      <div class="grid grid-cols-3 rounded-md border border-[var(--border)] bg-[var(--panel-soft)] p-1">
        <button
          v-for="item in modes"
          :key="item.id"
          type="button"
          class="rounded px-3 py-1.5 font-mono text-xs transition"
          :class="mode === item.id ? 'bg-terminal-green/15 text-terminal-green' : 'text-[var(--text-muted)] hover:text-terminal-blue'"
          @click="$emit('modeChange', item.id)"
        >
          {{ item.label }}
        </button>
      </div>
    </header>

    <div class="relative">
      <button
        type="button"
        class="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] bg-black/60 text-[var(--text-muted)] backdrop-blur transition hover:border-terminal-green/60 hover:text-terminal-green focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/80"
        :aria-label="copied ? 'Copied' : 'Copy terminal preview'"
        @click="$emit('copy')"
      >
        <svg v-if="copied" aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m20 6-11 11-5-5" />
        </svg>
        <svg v-else aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
      <pre class="max-h-[420px] min-h-[156px] overflow-auto whitespace-pre-wrap rounded-md border border-[var(--border)] bg-[var(--terminal-bg)] p-4 pr-14 text-sm leading-7 text-[var(--text-ink)] [overflow-wrap:anywhere]"><code>{{ content }}</code></pre>
    </div>
  </section>
</template>
