import React from 'react'
import Skin from './skin.jsx'
import ReactModal from "react-modal"

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }
  ok(kind) {
    this.props.close();
    this.props.addLayer("New layer", kind);
  }
  cancel() {
    this.props.close();
  }
  render () {
    const td = (kind) => {
      return <td>
        <img 
          onClick={() => this.ok(kind)}
          src={ "http://localhost:5000/img/icons/" + kind + ".png"}
          width={128}
          height={128}
          style={{ cursor: "pointer" }}
        />
      </td>
    };

    const rows = [
      <tr>{td("head")}{td("head_wear")}</tr>,
      <tr>{td("upper_body")}{td("upper_body_wear")}</tr>,
      <tr>{td("lower_body")}{td("lower_body_wear")}</tr>
    ];
    return (
      <ReactModal
        isOpen={this.props.isOpen}
      >
        <div style={{ textAlign: "right" }}>
          <span onClick={() => this.cancel()}
            style={{ fontSize: "32px", cursor: "pointer" }}>
            &times;
          </span>
        </div>

        <table style={{width: "100%"}}>
          <tbody>{rows}</tbody>
        </table>
      </ReactModal>
    );
  }
}

class Layers extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isModalOpen: false }
  }
  up(i) {
    if (i == 0) { return; }
    this.props.changeSkin(Skin.upLayer(this.props.skin, i), i - 1);
  }
  down(i) {
    if (i == this.props.skin.length - 1) { return; }
    this.props.changeSkin(Skin.downLayer(this.props.skin, i));
  }
  toggle(i) {
    this.props.changeSkin(Skin.toggleLayer(this.props.skin, i));
  }
  addLayer(label, kind) {
    this.props.changeSkin(Skin.unshiftNewLayer(this.props.skin, label, kind));
  }
  showModal() {
    this.setState({ isModalOpen: true });
  }
  closeModal() {
    this.setState({ isModalOpen: false });
  }
  delete(i) {
    const r = confirm("Are you sure to delete layer?");
    if (!r) { return; }
    this.props.changeSkin(Skin.deleteLayer(this.props.skin, i));
  }

  render() {
    const items = this.props.skin.layers.map((l, i) => {
      const buttonStyle = {
        padding: '0',
        width: '40px'
      };
      const rowStyle = {
        borderBottom: "1px solid #ccc",
      };
      if (!l.visible) {
        rowStyle.color = "#888";
      }

      const tdStyle = { padding: "0 4px" };
      const labelStyle = {
        width: "12em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: "32px"
      };

      return (
        <tr style={rowStyle}>
          <td style={tdStyle}>
            <input type="checkbox" checked={l.visible} onClick={() => this.toggle(i)}/>
          </td>  
          <td style={tdStyle}>
            <div style={labelStyle} onClick={(e) => this.props.editLayer(i) }>{l.label}</div>
          </td>
          <td style={tdStyle}>
            <button style={buttonStyle} onClick={() => this.down(i)} disabled={i == this.props.skin.layers.length - 1}>↓</button>
            <button style={buttonStyle} onClick={() => this.up(i)} disabled={i == 0}>↑</button>
            <button style={Object.assign({}, buttonStyle, {background: "#ea1c0d"})}
              onClick={() => this.delete(i)}>{"\u{26D4}"}</button>
          </td>
        </tr>
      );
    });

    return (
      <div style={{ display: "inline-block", verticalAlign: "top" }}>
        <Modal
          isOpen={this.state.isModalOpen}
          addLayer={this.addLayer.bind(this)}  
          close={this.closeModal.bind(this)}
        />
        <div onClick={() => this.showModal() }>
          <img src="assets/open-iconic/svg/plus.svg" height={24} width={24}/>
        </div>
        <table style={{ tableLayout: "fixed" }}>
          {items}
        </table>
      </div>
    );
  }
}

export default Layers;