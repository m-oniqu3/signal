//If fn is called again → cancel previous timer
export default function debounce(fn: () => void, delay: number) {
  let timeoutId: number;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(fn, delay);
  };
}
