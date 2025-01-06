import type { InvoiceLink } from '~types';

export default function SelectionView({ links, selection, setSelection, show }: {
  links: InvoiceLink[],
  selection: InvoiceLink[],
  setSelection: (links: InvoiceLink[]) => void,
  show: boolean}
) {
  if(!show) {
    return null;
  }

  return (
    <div>
      { links.map(link => (
        <div key={link.id} style={{ display: 'flex', flexDirection: 'row' }}>
          <input type="checkbox" onChange={e => {
            if(e.target.checked) {
              setSelection([...selection, link]);
            } else {
              setSelection(selection.filter(l => l.id !== link.id));
            }
          }} />
          <p>{`[${link.id}] ${link.name} (${link.date})`}</p>
        </div>
      )) }
    </div>
  )
}