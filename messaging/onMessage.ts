import Browser from 'webextension-polyfill';

export const onMessage = (key: string, callback: any) => {
  try {
    Browser.runtime.onMessage.addListener((event: any, _sender: any, sendResponse) => {
      if (event.key === key) {
        return callback(event, sendResponse);
      } else {
        return true;
      }
    })
  } catch (error) {
    console.warn(error.message);
    throw error;
  }
}