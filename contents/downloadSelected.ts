import type { InvoiceLink } from '~types';
import messagingActions from "~messaging/constants";

export function getTableLinks(checkedOnly: boolean): InvoiceLink[] {
  const links = [];
  document.querySelectorAll('table tbody tr').forEach(row => {
    const checkbox = row.children[5]?.children[0] as HTMLInputElement;
    if (checkedOnly) {
      if (!checkbox.checked) { return; } else { checkbox.checked = false; }
    }

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

export default function downloadSelected() {
  // Filter selectedRows
  const links = getTableLinks(true);

  const event = new CustomEvent(messagingActions.CSUI_TO_BACKGROUND, { detail: links });
  window.dispatchEvent(event);
}