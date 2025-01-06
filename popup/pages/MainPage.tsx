import { useState } from 'react';

import Browser from 'webextension-polyfill';
import messagingActions from "~messaging/constants";
import { sendMessage } from "~messaging/sendMessage";
import type { InvoiceLink } from '~types';

import Layout from '~popup/layout/Layout';

import DefaultView from '~popup/views/DefaultView';
import SelectionView from '~popup/views/SelectionView';
import ResultView from '~popup/views/ResultView';

const stageToButtonLabel = {
  initial: 'Read page content',
  loading: 'Loading...',
  readyToDownload: 'Download',
  done: 'Go back'
}

export default function MainPage() {
  const [stage, setStage] = useState('initial');
  const [links, setLinks] = useState([] as InvoiceLink[]);
  const [selection, setSelection] = useState([] as InvoiceLink[]);

  const handleClick = async () => {
    if (stage === 'loading') { return; }

    if (stage === 'initial') {
      setStage('loading');
      const tabs = await Browser.tabs.query({ active: true, currentWindow: true })
      const resp = await sendMessage(tabs[0].id, messagingActions.GET_LINKS, {}) as InvoiceLink[];
      console.log('links', resp);
      setLinks(resp);
      setStage('readyToDownload');
    }

    if (stage === 'readyToDownload') {
      selection.forEach((link: InvoiceLink) => {
        Browser.downloads.download({ url: link.url });
      });
      setSelection([]);
      setStage('done');
    }

    if (stage === 'done') {
      setStage('initial');
    }
  };

  return (
    <div style={{ width: '400px' }}>
      <Layout>
        <DefaultView show={ stage === 'initial' } />
        <SelectionView
          links={links}
          selection={selection}
          setSelection={setSelection}
          show={ stage === 'readyToDownload' }
        />
        <ResultView show={ stage === 'done' } />
        <button onClick={handleClick}>{stageToButtonLabel[stage]}</button>
      </Layout>
    </div>
  )
}