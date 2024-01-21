export const getLocalStorage = (key: string) => {
  return new Promise<any>((resolve, _) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
};
