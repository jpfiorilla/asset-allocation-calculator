import { ref, onScopeDispose } from "vue";

export function useFetch<T = unknown>() {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  let controller: AbortController | null = null;

  async function execute(url: string, options?: RequestInit) {
    if (controller) controller.abort();

    controller = new AbortController();
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(res.statusText);

      data.value = (await res.json()) as T;
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        error.value = err as Error;
      }
    } finally {
      loading.value = false;
    }
  }

  onScopeDispose(() => {
    if (controller) controller.abort();
  });

  return { data, error, loading, execute };
}
