import React from 'react'
import ReactModal from "react-modal"
import ColorPicker from "./color_picker";


class Modal extends React.Component {
  render() {
    return <ReactModal
      isOpen={this.props.isOpen}
    >
      <div style={{ textAlign: "right" }}>
        <span onClick={() => this.props.close()}
          style={{ fontSize: "32px", cursor: "pointer" }}>
          &times;
        </span>
      </div>

      <ColorPicker
        colors={this.props.colors}
        colorIndex={this.props.colorIndex}
        changeColor={this.props.changeColor}
      />
      <button onClick={() => this.props.close()}>OK</button>
    </ReactModal>
  }
}

export default class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isModalOpen: false };
  }
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
  closeModal() {
    this.setState({ isModalOpen: false });
  }
  openModal() {
    this.setState({ isModalOpen: true });
  }
  render() {
    const colors = this.props.colors;
    const colorIndex = this.props.colorIndex;
    const rowCount = this.props.rowCount;
    const colCount = this.props.colCount;

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

          cols.push(<td
            style={style}
            onClick={() => this.props.changeColorIndex(i)}
          ></td>);
        })(y + x * rowCount);
      }
      rows.push(cols);
    }

    const style = {
      border: '1px solid #CCC',
      borderCollapse: 'collapse',
      borderSpacing: '2px',
      verticalAlign: 'top',
      display: 'inline-block'
    };
    return <div style={{ margin: "4px", display: 'inline-block', verticalAlign: "top" }}>
      <Modal
        isOpen={this.state.isModalOpen}
        colorIndex={this.props.colorIndex}
        colors={this.props.colors}
        changeColor={this.props.changeColor}
        close={this.closeModal.bind(this)}
        colorString={this.props.colors[this.props.colorIndex]}
      />
      <table className="palette" style={style}>
        <tbody>{
          rows.map(function(cols) { return <tr>{cols}</tr>; })
        }</tbody>
      </table>
      <br />
      <button onClick={this.openModal.bind(this)}>Mixing</button>
    </div>;
  }
}