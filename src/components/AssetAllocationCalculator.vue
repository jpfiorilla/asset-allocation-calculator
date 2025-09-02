<script setup lang="ts">
import { computed, ref } from "vue";

const { conversationRates } = defineProps<{
  conversationRates?: Record<string, string>;
}>();

const usd = ref<number | null>(null);

const expectedValues = computed(() => {
  if (!conversationRates || usd.value == null) return { btc: null, eth: null };

  const seventy = usd.value * 0.7;
  const thirty = usd.value * 0.3;

  return {
    btc: seventy * parseFloat(conversationRates.BTC),
    eth: thirty * parseFloat(conversationRates.ETH),
  };
});
</script>

<template>
  <div class="AssetAllocationCalculator">
    <h1>Asset allocation calculator</h1>
    <div v-if="!conversationRates">Loading exchange rates...</div>
    <div v-else class="AssetAllocationCalculator--Row">
      <div class="AssetAllocationCalculator--Left">
        <div class="AssetAllocationCalculator--InputWrapper">
          <label for="usd">Investable assets</label>
          <input
            autofocus
            id="usd"
            v-model.number="usd"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
      </div>
      <div class="AssetAllocationCalculator--Right">
        <div>
          <h3>70% BTC allocation</h3>
          <div>{{ expectedValues.btc?.toFixed(8) ?? "–" }}</div>
        </div>
        <div>
          <h3>30% ETH allocation</h3>
          <div>{{ expectedValues.eth?.toFixed(8) ?? "–" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.AssetAllocationCalculator {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  h1,
  h3 {
    margin: auto;
  }
  .AssetAllocationCalculator--Row {
    display: flex;
    gap: 2rem;
    > * {
      flex: 1 1 50%;
    }
    .AssetAllocationCalculator--Left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .AssetAllocationCalculator--InputWrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        label {
          font-size: 1.17rem;
          font-weight: bold;
        }
        input {
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
        }
      }
    }
    .AssetAllocationCalculator--Right {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      > * {
        flex: 1 1 50%;
      }
    }
  }
}

@media (max-width: 600px) {
  .AssetAllocationCalculator--Row {
    flex-direction: column;
    .AssetAllocationCalculator--Right {
      flex-direction: row;
    }
  }
}
</style>
