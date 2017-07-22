import React from 'react'

export default class Palette extends React.Component {
  render() {
    const colors = this.props.colors;
    const colorIndex = this.props.colorIndex;
    const rowCount = 4;
    const colCount = 8;

    const rows = [];
    const indexes = [];
    let i = 0;

    for (var y = 0; y < rowCount; ++y) {
      const cols = [];
      for (var x = 0; x < colCount; ++x) {
        ((i) => {
          const arr = colors[i];
          const rgb = "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";

          const style = {
            backgroundColor: rgb,
            border: '2px solid #CCC',
            width: '32px',
            height: '32px',
            fontSize: '8px',
            padding: 0
          };
          if (i == colorIndex) {
            style.border = '2px solid black';
          }
          cols.push(<td
            style={style}
            onClick={() => this.props.changeColorIndex(i)}
          >{i}</td>);
        })(y + x * rowCount);
      }
      rows.push(cols);
    }

    const style = {
      border: '1px solid #CCC',
      borderCollapse: 'separate',
      borderSpacing: '2px'
    };

    return <table className="palette" style={style}>
      <tbody>{
        rows.map(function(cols) { return <tr>{cols}</tr>; })
      }</tbody>
    </table>;
  }
}