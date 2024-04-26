<script setup lang="ts">
import pkg from "../../package.json";

const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <a
    :href="`https://tsdocs.dev/docs/@medrunner/api-client/${pkg.version}/interfaces/${props.name}.html`"
    target="_blank"
    rel="noreferrer"
    >{{ props.name }}</a
  >
</template>

<style scoped>
a {
  border-radius: 4px;
  padding: 3px 6px;
  background-color: var(--vp-code-bg);
  transition: color 0.25s, background-color 0.5s;
  font-size: var(--vp-code-font-size);
  color: var(--vp-code-color);
  text-decoration: none;
}
</style>
