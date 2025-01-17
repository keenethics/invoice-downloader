import JSZip from 'jszip';
import type { InvoiceLink } from '~types';
import messagingActions from "~messaging/constants";
import { onMessage } from '~messaging/runtime';
import { sendMessage } from '~messaging/tabs';

async function downloadLinks(links: InvoiceLink[]): Promise<void> {
  const zip = new JSZip();
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })

  // Save files to ZIP object
  for (const [idx, link] of links.entries()) {
    try {
      const response = await fetch(link.url);
      if (!response.ok) throw new Error('Failed to fetch a file');

      const blob = await response.blob();
      const folderName = link.date.split('/').toSpliced(1, 1).join('-');
      zip.file(`${folderName}/[${link.id}] ${link.name}.pdf`, blob);
    } catch {
      console.error(`Could not download invoice "${link.name}" from "${link.url}"`);
    }
    sendMessage(tabs[0].id, messagingActions.DOWNLOAD_PROGRESS, idx + 1);
  }

  // Generate the ZIP file
  const reader = new FileReader();
  const zipBlob = await zip.generateAsync({ type: "blob" });

  reader.onloadend = () => {
    const dataUrl = reader.result;
    chrome.downloads.download(
      {
        url: dataUrl as string,
        filename: 'invoices.zip'
      }
    );
  };

  reader.onerror = () => {
    console.error("Failed to convert Blob to Data URL");
  };

  reader.readAsDataURL(zipBlob);
  return;
}

onMessage(messagingActions.DOWNLOAD_ALL, (
  message: Record<string, any>
) => {
  console.log('To be downloaded', message.event);
  downloadLinks(message.event as InvoiceLink[])
    .then(async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      sendMessage(tabs[0].id, messagingActions.DOWNLOAD_END, 'success');
    })
    .catch(async e => {
      console.error(e);
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      sendMessage(tabs[0].id, messagingActions.DOWNLOAD_END, 'fail');
    });
});
