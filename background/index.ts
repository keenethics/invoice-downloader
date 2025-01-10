import JSZip from 'jszip';
import type { InvoiceLink } from '~types';
import messagingActions from "~messaging/constants";

async function downloadLinks(links: InvoiceLink[]) {
  const zip = new JSZip();

  // Save files to ZIP object
  for (const link of links) {
    try {
      const response = await fetch(link.url);
      if (!response.ok) throw new Error('Failed to fetch a file');

      const blob = await response.blob();
      const folderName = link.date.split('/').toSpliced(1, 1).join('-');
      zip.file(`${folderName}/[${link.id}] ${link.name}.pdf`, blob);
    } catch {
      console.error(`Could not download invoice "${link.name}" from "${link.url}"`);
    }
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
}

chrome.runtime.onMessage.addListener((message: Record<string, unknown>) => {
  console.log('To be downloaded', message.event);
  if (message.key === messagingActions.CSUI_TO_BACKGROUND) {
    downloadLinks(message.event as InvoiceLink[]);
  }
});
