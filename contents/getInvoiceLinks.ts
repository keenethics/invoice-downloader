import messagingActions from '~messaging/constants';
import { onMessage } from '~messaging/runtime/onMessage';
import { getTableLinks } from './downloadSelected';
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://keenethics.itfin.io/invoices?*'],
};

console.log('Invoice downloader script successfully initialized.');

onMessage(messagingActions.GET_LINKS, (_message, sendResponse) => {
  sendResponse(getTableLinks(false));
  return true;
});