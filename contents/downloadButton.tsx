import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoCSUIProps, PlasmoRender } from "plasmo";
import { useEffect, useState, type FC } from "react";
import { createRoot } from "react-dom/client";

import messagingActions from "~messaging/constants";
import { onMessage } from "~messaging/csui";

import downloadAll from "./downloadAll";

export const config: PlasmoCSConfig = {
  matches: ['$PLASMO_PUBLIC_INVOICE_PAGE'],
  world: 'MAIN',
}

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector(`table thead tr`);
      if (rootContainerParent) {
        clearInterval(checkInterval);
        // Add Download button container
        const rootContainer = rootContainerParent.children[5] as HTMLElement;
        rootContainer.innerText = '';

        // Change "Sum" column alignment
        const sumColumn = rootContainerParent.children[4];
        sumColumn.classList.remove('text-end');
        sumColumn.classList.add('text-center');

        resolve(rootContainer);
      }
    }, 800)
  });

const DownloadButton: FC<PlasmoCSUIProps> = () => {
  const buttonLabels = {
    DOWNLOAD: 'Download All',
    LOADING: (count: number, linkCount) => `Loading (${count}/${linkCount})`,
  }

  const [buttonLabel, setButtonLabel] = useState(buttonLabels.DOWNLOAD);
  const [isDisabled, setIsDisabled] = useState(false);
  const [linkCount, setLinkCount] = useState(0);

  const handleClick = () => {
    // Disable button
    setIsDisabled(true);
    
    // Download all invoices
    const length = downloadAll();
    setLinkCount(length);
    
    // Set progress counter
    setButtonLabel(buttonLabels.LOADING(0, length));
  };

  // Update button label progress
  useEffect(() => {
    const handleProgress = onMessage(messagingActions.DOWNLOAD_PROGRESS, (data) => {
      setButtonLabel(buttonLabels.LOADING(data, linkCount));
    })
    window.addEventListener('message', handleProgress);
    return () => window.removeEventListener('message', handleProgress);
  }, [linkCount]);

  // Return button status to initial after download
  useEffect(() => {
    const handleResponse = onMessage(messagingActions.DOWNLOAD_END, (status) => {
      if (status === 'fail') {
        console.warn('Download failed. Please try again.')
      }
      setButtonLabel(buttonLabels.DOWNLOAD);
      setIsDisabled(false);
    })
    window.addEventListener('message', handleResponse);
    return () => window.removeEventListener('message', handleResponse);
  }, []);

  return (
    <button className="btn btn-primary btn-squircle" onClick={handleClick} disabled={isDisabled}>
      {buttonLabel}
    </button>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer();
  const root = createRoot(rootContainer);
  root.render(<DownloadButton />);
}

export default DownloadButton;