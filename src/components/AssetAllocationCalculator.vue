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
  <div class="calculator">
    <h1>Asset allocation calculator</h1>
    <div v-if="!conversationRates">Loading exchange rates...</div>
    <div v-else class="calculator-row">
      <div class="left">
        <div class="calculator-input">
          <label for="usd">Investable assets</label>
          <div class="input-wrapper">
            <div class="prefix">$</div>
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
      </div>
      <div class="calculator-output">
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
.calculator {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  h3 {
    margin: 0;
  }
  .calculator-row {
    display: flex;
    gap: 2rem;
    > * {
      flex: 1 1 50%;
    }
    .left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .calculator-input {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        label {
          font-size: 1.17rem;
          font-weight: bold;
        }
        .input-wrapper {
          display: flex;
          align-items: center;
          position: relative;
          .prefix {
            position: absolute;
            left: 0.5rem;
            color: grey;
            pointer-events: none;
            transform: translateY(-1px);
          }
          input {
            padding: 0.25rem 0.5rem 0.25rem 1.5rem;
            border-radius: 8px;
            flex: 1 0 auto;
          }
        }
      }
    }
    .calculator-output {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
}

@media (max-width: 600px) {
  .calculator {
    .calculator-row {
      flex-direction: column;
      .calculator-output {
        flex-direction: row;
        > * {
          flex: 1 1 50%;
        }
      }
    }
  }
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
