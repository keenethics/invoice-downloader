export const onMessage = (key: string, callback: any) => {
  try {
    chrome.runtime.onMessage.addListener((event: any, _sender: any, sendResponse) => {
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

export const sendMessage = async (key: string, event: any) => {
  try {
    return chrome.runtime.sendMessage({ key, event });
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Could not establish connection. Receiving end does not exist.'
    ) {
      throw error
    }
  }
}