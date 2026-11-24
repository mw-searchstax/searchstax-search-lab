<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { mountProfileSearch } from './mount.js';

const host = ref(null);
let dispose;
onMounted(() => { dispose = mountProfileSearch(host.value); });
onBeforeUnmount(() => dispose?.());
</script>

<template><div ref="host"></div></template>
