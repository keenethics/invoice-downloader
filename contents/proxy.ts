import type { PlasmoCSConfig } from "plasmo/dist/type";

import messagingActions from "~messaging/constants";
import * as csuiMessaging from "~messaging/csui";
import * as runtimeMessaging from "~messaging/runtime";

export const config: PlasmoCSConfig = {
  matches: ['$PLASMO_PUBLIC_INVOICE_PAGE'],
};

// CSUI -> Background messaging proxy
csuiMessaging.onMessage(messagingActions.DOWNLOAD_ALL, (links) => {
  runtimeMessaging.sendMessage(messagingActions.DOWNLOAD_ALL , links);
}, true);

// Background -> CSUI messaging proxies
runtimeMessaging.onMessage(messagingActions.DOWNLOAD_PROGRESS, (event, sendResponse) => {
  csuiMessaging.sendMessage(messagingActions.DOWNLOAD_PROGRESS, event.event);
  sendResponse(true);
})

runtimeMessaging.onMessage(messagingActions.DOWNLOAD_END, (event, sendResponse) => {
  csuiMessaging.sendMessage(messagingActions.DOWNLOAD_END, event.event);
  sendResponse(true);
})