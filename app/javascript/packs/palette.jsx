import React from 'react'
import ReactModal from "react-modal"


class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.color };
  }
  ok() {
    this.props.close();
    this.props.changeColor(i, this.stringToRgb(this.state.value));
  }
  cancel() {
    this.props.close();
  }
  rgbToString(rgb) {
    return "#" + rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
  }
  stringToRgb(value) {
    return [
      parseInt(value.substring(1, 3)),
      parseInt(value.substring(3, 5)),
      parseInt(value.substring(5, 7))
    ];
  }
  render () {
    return (
      <ReactModal 
        isOpen={this.props.isOpen}
        contentLabel="Minimal Modal Example"
      >
        <input type={"color"} value={this.state.value} 
          onChange={(e) => this.setState({value: e.target.value})}/>
        <br/>
        <button onClick={() => this.ok()}>OK</button>
        &nbsp;
        <button style={{background: 'white', color: 'black'}}
                onClick={() => this.cancel()}>Cancel</button>      
      </ReactModal>
    );
  }
}

export default class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isModalOpen: false };
  }
  showModal() {
    this.setState({isModalOpen: true});
  }
  closeModal() {
    this.setState({isModalOpen: false});
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
            onDoubleClick={() => this.showModal()}
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
    return <div>
      {/* <Modal
        isOpen={this.state.isModalOpen}
        close={this.closeModal.bind(this)}
        changeColor={this.props.changeColor}
        colorIndex={colorIndex}
        color={colors[colorIndex]}
      /> */}
      <table className="palette" style={style}>
        <tbody>{
          rows.map(function(cols) { return <tr>{cols}</tr>; })
        }</tbody>
      </table>
    </div>;
  }
}