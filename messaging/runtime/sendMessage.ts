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