import type { PlasmoCSConfig } from 'plasmo/dist/type';

import type { InvoiceLink } from '~types';
import messagingActions from "~messaging/constants";
import { sendMessage } from '~messaging/csui';

export const config: PlasmoCSConfig = {
  matches: ['$PLASMO_PUBLIC_INVOICE_PAGE'],
};

export function getTableLinks(): InvoiceLink[] {
  const links = [];
  document.querySelectorAll('table tbody tr').forEach(row => {
    const detailsLink = row.children[1].children[0].textContent;

    // Text in a format xxx.x.xx-invoice-name
    const invoiceNameParts = detailsLink
      .replaceAll('#', '')
      .replaceAll(/(\s*-+\s*|\s+)/g, "-")
      .slice(0, -1)
      .split('-');

    // Text in a format xxx.x.xx
    const invoiceId = invoiceNameParts[0];
    const invoiceName = invoiceNameParts.slice(1).join('-');
    
    // Date in format ['MM', 'dd', 'yyyy']
    const dateParts = row.children[2].textContent
      .match(/[\d/]+/)[0]
      ?.split('/');
    
    // Date in format yyyy-MM-dd
    const date = dateParts[2] + '-' + dateParts[0] + '-' + dateParts[1];

    // Invoice download link
    links.push({
      id: invoiceId,
      name: invoiceName.replaceAll('-', ' '),
      date: dateParts.join('/'),
      url: `${process.env.PLASMO_PUBLIC_API_ROUTE}/invoices/${invoiceId}/pdf?filename=${invoiceId}-${invoiceName}_${date}.pdf&templateId=14`
    } as InvoiceLink);
  });

  return links;
}

export default function downloadAll(): number {
  // Filter selectedRows
  const links = getTableLinks();
  sendMessage(messagingActions.DOWNLOAD_ALL, links);
  return links.length;
}