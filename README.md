# Invoice Downloader extension.

## What does it do

It allows to download the Invoices right from the invoice list page.

To use it:
1. Visit [Invoices list page](https://keenethics.itfin.io/invoices)
2. Select invoices via checkboxes under **Download** button.
3. Click **Download** and wait a few seconds.

or, download all invoices separately:

1. Visit [Invoices list page](https://keenethics.itfin.io/invoices)
2. Select **Invoice downloader** extension from the top-right extensions menu.
3. Click **Read page content** to load all invoices from the page.
4. Select checkboxes near every invoice you want to download.
5. click **Download**.
6. (optional) Click **Go back** to repeat the steps (3-5) if needed.

## How to run it
#### To run the dev version:
1. Run
    ```bash
    pnpm dev
    # or
    npm run dev
    ```
2. Open Chrome browser and load local extension from `build/chrome-mv3-dev`.
3. Open (or refresh) invoice list page.

#### To run production version:
1. Disable dev version from [Extensions page](`chrome://extensions/`).
2. Run
    ```bash
    pnpm build
    # or
    npm run build
    ```
3. Open Chrome browser and load local extension from `build/chrome-mv3-prod`.
4. Open (or refresh) invoice list page.

#### To run any release
1. Open Chrome browser and load local extension from `Invoice Downloader vX.Y.Z.zip/chrome-mv3-prod`.
2. Open (or refresh) invoice list page.


#### Changelog
v0.0.2:
- Added Download button and checkboxes for on-page selection and bulk download (as a .zip archive)
v0.0.1:
- Initial release