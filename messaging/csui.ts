export const sendMessage = (key: string, data: any) =>
  window.postMessage({ type: key, data }, process.env.PLASMO_PUBLIC_INVOICE_DOMAIN);

export const onMessage = (
  key: string, 
  callback: (data: any) => void, 
  subscribe: boolean = false
): (event: Event) => any | void => {
  const handler = (event) => {
    if (event.origin !== process.env.PLASMO_PUBLIC_INVOICE_DOMAIN || event.data.type !== key) {
      return;
    }

    return callback(event.data.data);
  }

  return (subscribe
    ? window.addEventListener('message', handler)
    : handler
  ) as (event: Event) => any | void;
}