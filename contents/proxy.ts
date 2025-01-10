import messagingActions from "~messaging/constants";

// Register CSUI -> Background proxy
window.addEventListener(messagingActions.CSUI_TO_BACKGROUND, function(event: unknown) {
  const data = event as Record<string, unknown>
  chrome.runtime.sendMessage({ key: messagingActions.CSUI_TO_BACKGROUND , event: data.detail });
}, false);