import React from 'react'
import ReactModal from "react-modal"



export default class Palette extends React.Component {
  rgbToString(rgb) {
    const hex = (v) => ("0" + v.toString(16)).substr(-2);
    return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
  }
  stringToRgb(value) {
    return [
      parseInt(value.substring(1, 3), 16),
      parseInt(value.substring(3, 5), 16),
      parseInt(value.substring(5, 7), 16)
    ];
  }
  changeColor(i, value) {
    this.props.changeColor(i, this.stringToRgb(value));
  }
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
          const rgb = colors[i];

          const style = {
            backgroundColor: this.rgbToString(rgb),
            border: '2px solid #CCC',
            width: '32px',
            height: '32px',
            fontSize: '8px',
            padding: 0
          };
          if (i == colorIndex) {
            style.border = '2px solid black';
          }

          let colorInput;
          cols.push(<td
            style={style}
            onClick={() => this.props.changeColorIndex(i)}
            onDoubleClick={() => colorInput.click()}
          >
            {i}
            <input type={"color"}
              style={{display: "none"}}
              value={this.rgbToString(rgb)}
              onChange={(e) => this.changeColor(i, e.target.value)}
              ref={(e) => { colorInput = e; }}
              key={"colorInput" + i}
            />
          </td>);
        })(y + x * rowCount);
      }
      rows.push(cols);
    }

    const style = {
      border: '1px solid #CCC',
      borderCollapse: 'separate',
      borderSpacing: '2px'
    };
    return <div>
      <table className="palette" style={style}>
        <tbody>{
          rows.map(function(cols) { return <tr>{cols}</tr>; })
        }</tbody>
      </table>
    </div>;
  }
}