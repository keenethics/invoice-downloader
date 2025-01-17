import type { PlasmoCSConfig } from 'plasmo';

import messagingActions from '~messaging/constants';
import { onMessage } from '~messaging/runtime';

import { getTableLinks } from './downloadAll';

export const config: PlasmoCSConfig = {
  matches: ['$PLASMO_PUBLIC_INVOICE_PAGE'],
};

console.log('Invoice downloader script successfully initialized.');

onMessage(messagingActions.GET_LINKS, (_message: unknown, sendResponse: (data: unknown) => void) => {
  sendResponse(getTableLinks());
  return true;
});