export const getLeetcodeVersion = () => {
  if (document.getElementById('__next')) return 'NEW';
  return 'OLD';
};

export const removeContent = (
  observer: MutationObserver,
  observe: () => void
) => {
  observer.disconnect();
  document.getElementById('push-to-sheets-btn')?.remove();
  document.getElementById('time-taken-field')?.remove();
  observe();
};
