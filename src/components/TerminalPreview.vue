<script setup lang="ts">
export type PreviewMode = 'command' | 'brewfile' | 'script';

defineProps<{
  content: string;
  copied: boolean;
  mode: PreviewMode;
}>();

defineEmits<{
  modeChange: [mode: PreviewMode];
}>();

const modes: Array<{ id: PreviewMode; label: string }> = [
  { id: 'command', label: 'Command' },
  { id: 'brewfile', label: 'Brewfile' },
  { id: 'script', label: 'Script' },
];
</script>

<template>
  <section class="rounded-lg border border-white/10 bg-black/35 p-4 backdrop-blur">
    <header class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="font-mono text-sm font-semibold uppercase tracking-normal text-terminal-green">
          Terminal Preview
        </h2>
        <span class="font-mono text-xs text-terminal-muted">
          <span class="mr-2 inline-block h-2 w-2 rounded-full bg-terminal-green"></span>
          {{ copied ? 'Copied' : 'Live' }}
        </span>
      </div>

      <div class="grid grid-cols-3 rounded-md border border-white/10 bg-black/30 p-1">
        <button
          v-for="item in modes"
          :key="item.id"
          type="button"
          class="rounded px-3 py-1.5 font-mono text-xs transition"
          :class="mode === item.id ? 'bg-terminal-green/15 text-terminal-green' : 'text-terminal-muted hover:text-terminal-blue'"
          @click="$emit('modeChange', item.id)"
        >
          {{ item.label }}
        </button>
      </div>
    </header>

    <pre class="max-h-[420px] min-h-[156px] overflow-auto whitespace-pre-wrap rounded-md border border-white/10 bg-[#030607] p-4 text-sm leading-7 text-terminal-ink [overflow-wrap:anywhere]"><code>{{ content }}</code></pre>
  </section>
</template>
