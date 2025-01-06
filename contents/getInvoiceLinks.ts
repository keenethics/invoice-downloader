import type { PlasmoCSConfig } from 'plasmo';
import { onMessage } from '~messaging/onMessage';
import messagingActions from '~messaging/constants';
import type { InvoiceLink } from '~types';

export const SEND_ROWS = 'sendRows';
export const config: PlasmoCSConfig = {
  matches: ['https://keenethics.itfin.io/invoices?*'],
};

console.log('Invoice downloader script successfully initialized.');

onMessage(messagingActions.GET_LINKS, (message, sendResponse) => {
  const invoiceLinks = [];
  document.querySelectorAll('table tr td a').forEach(node => {
    // Text in a format xxx.x.xx-invoice-name
    const invoiceNameParts = node.textContent
      .replaceAll('#', '')
      .replaceAll(/(\s*-+\s*|\s+)/g, "-")
      .slice(0, -1)
      .split('-');
    
    // Text in a format xxx.x.xx
    const invoiceId = invoiceNameParts[0];
    const invoiceName = invoiceNameParts.slice(1).join('-');

    // Date in format ['MM', 'dd', 'yyyy']
    const dateParts = node.parentElement.parentElement.children[2].textContent
      .match(/[\d/]+/)[0]
      ?.split('/');
    
    // Date in format yyyy-MM-dd
    const date = dateParts[2] + '-' + dateParts[0] + '-' + dateParts[1];

    // Invoice download link
    invoiceLinks.push({
      id: invoiceId,
      name: invoiceName.replaceAll('-', ' '),
      date: dateParts.join('/'),
      url: `${process.env.PLASMO_PUBLIC_API_ROUTE}/invoices/${invoiceId}/pdf?filename=${invoiceId}-${invoiceName}_${date}.pdf&templateId=14`
    } as InvoiceLink);
  });
  sendResponse(invoiceLinks);
});