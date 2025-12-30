export function debounce(fn: () => void, delay = 300) {
  let timeoutId: number;

  return () => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn();
    }, delay);
  };
}
