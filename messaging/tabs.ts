export const sendMessage = async (id: number, key: string, event: any) => {
  try {
    return chrome.tabs.sendMessage(id, { key, event })
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Could not establish connection. Receiving end does not exist.'
    ) {
      throw error
    }
  }
}