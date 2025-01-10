import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoCSUIProps, PlasmoRender } from "plasmo"
import { useEffect, type FC } from "react"
import { createRoot } from "react-dom/client";
import downloadSelected from "./downloadSelected";
import addCheckboxes from "./addCheckboxes";

export const config: PlasmoCSConfig = {
  matches: ["https://keenethics.itfin.io/invoices?*"],
  world: 'MAIN',
}

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector(`table thead tr`);
      if (rootContainerParent) {
        clearInterval(checkInterval);
        // Add Download button container
        const rootContainer = document.createElement("th");
        rootContainerParent.insertBefore(rootContainer, rootContainerParent.lastChild);

        // Change "Sum" column alignment
        const sumColumn = document.querySelector('table thead tr th:nth-child(5)');
        sumColumn.classList.remove('text-end');
        sumColumn.classList.add('text-center');

        resolve(rootContainer);
      }
    }, 800)
  });

const DownloadButton: FC<PlasmoCSUIProps> = () => {
  useEffect(() => {
    const rows = document.querySelectorAll('table tbody tr');
    addCheckboxes(rows);
  }, []);

  const handleClick = () => {
    // Download selected invoices
    downloadSelected();
  };

  return (
    <button className="btn btn-primary btn-squircle" onClick={handleClick}>
      Download
    </button>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer();
  const root = createRoot(rootContainer);
  root.render(<DownloadButton />);
}

export default DownloadButton;