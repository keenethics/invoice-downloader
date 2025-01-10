export default function downloadSelected(rows: NodeListOf<Element>) {
  rows.forEach((row, i) => {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', 'selected');
    checkbox.setAttribute('value', i.toString());
    checkbox.setAttribute('style', 'width:25px;height:25px;margin-left:40px;');
    const cell = document.createElement('td');
    cell.appendChild(checkbox);
    row.insertBefore(cell, row.lastChild);
  });
};
