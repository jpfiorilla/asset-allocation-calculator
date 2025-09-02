<script setup lang="ts">
import { computed } from "vue";
import type { CoinbaseRates } from "./types";
import AssetAllocationCalculator from "./components/AssetAllocationCalculator.vue";
import { useFetch } from "./utils/useFetch";

const { data, execute } = useFetch<{ data: CoinbaseRates }>();
execute("https://api.coinbase.com/v2/exchange-rates?currency=USD");

const rates = computed(() => data.value?.data.rates);
</script>

<template>
  <AssetAllocationCalculator :conversationRates="rates" />
</template>

<style scoped></style>
