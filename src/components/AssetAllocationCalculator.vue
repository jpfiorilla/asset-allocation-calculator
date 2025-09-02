<script setup lang="ts">
import { computed, ref } from "vue";

const { conversationRates } = defineProps<{
  conversationRates?: Record<string, string>;
}>();

const usd = ref<number | null>(null);
const btc = ref<number | null>(null);
const eth = ref<number | null>(null);

const getCoinValues = (usdValue: number | null) => {
  if (!conversationRates || usdValue == null) return { btc: null, eth: null };

  const seventy = usdValue * 0.7;
  const thirty = usdValue * 0.3;

  return {
    btc: seventy * parseFloat(conversationRates.BTC),
    eth: thirty * parseFloat(conversationRates.ETH),
  };
};

const expectedValues = computed(() => getCoinValues(usd.value));

const isBtcStale = computed(() => {
  if (btc.value === null || expectedValues.value.btc === null) return true;
  return btc.value !== expectedValues.value.btc;
});

const isEthStale = computed(() => {
  if (eth.value === null || expectedValues.value.eth === null) return true;
  return eth.value !== expectedValues.value.eth;
});

const handleSubmit = () => {
  const coinValues = getCoinValues(usd.value);

  btc.value = coinValues.btc;
  eth.value = coinValues.eth;
};
</script>

<template>
  <div class="AssetAllocationCalculator">
    <h1>Asset allocation calculator</h1>
    <div v-if="!conversationRates">Loading exchange rates...</div>
    <div v-else class="AssetAllocationCalculator--Row">
      <form
        class="AssetAllocationCalculator--Left"
        @submit.prevent="handleSubmit"
      >
        <div class="AssetAllocationCalculator--InputWrapper">
          <label for="usd">Investable assets</label>
          <input
            autofocus
            id="usd"
            v-model.number="usd"
            type="text"
            inputmode="decimal"
            pattern="^\d+(\.\d{0,2})?$"
            placeholder="0.00"
          />
        </div>
        <button :disabled="usd == null || isNaN(usd) || usd <= 0" type="submit">
          Calculate
        </button>
      </form>
      <div class="AssetAllocationCalculator--Right">
        <div>
          <div>70% BTC allocation</div>
          <div :class="['allocation-value', { stale: isBtcStale }]">
            {{ btc?.toFixed(8) ?? "–" }}
          </div>
        </div>
        <div>
          <div>30% ETH allocation</div>
          <div :class="['allocation-value', { stale: isEthStale }]">
            {{ eth?.toFixed(8) ?? "–" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.AssetAllocationCalculator {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  h1 {
    margin: auto;
  }
  .AssetAllocationCalculator--Row {
    display: flex;
    gap: 2rem;
    > * {
      flex: 1 1 50%;
    }
    form.AssetAllocationCalculator--Left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .AssetAllocationCalculator--InputWrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      button[type="submit"] {
        transition: background-color 75ms ease;
        &:disabled {
          background-color: grey;
          cursor: pointer;
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
  .allocation-value {
    transition: color 75ms ease;
    &.stale {
      color: grey;
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
