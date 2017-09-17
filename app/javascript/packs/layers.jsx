import React from 'react'
import Skin from './skin.jsx'
import ReactModal from "react-modal"

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kind: "head"
    };
  }
  ok() {
    this.props.close();
    const name = this.layer_names()[this.state.kind];
    this.props.addLayer(name, this.state.kind);
  }
  cancel() {
    this.props.close();
  }
  layer_names() {
    return {
      head: "頭部",
      head_wear: "頭部（服）",
      upper_body: "上半身",
      upper_body_wear: "上半身（服）",
      lower_body: "下半身",
      lower_body_wear: "下半身（服）"
    };
  }
  render () {
    const td = (kind) => {
      return <td>
        <label style={{display: "block"}}>
          <input type={"radio"} name={"kind"} value={kind}
            onChange={() => this.setState({kind: kind})}
            checked={this.state.kind === kind}
          />{this.layer_names()[kind]}
        </label>
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
        contentLabel="Minimal Modal Example"
      >
        <table style={{width: "100%"}}>
          <tbody>{rows}</tbody>
        </table>

        <button onClick={() => this.ok()}>OK</button>
        &nbsp;
        <button style={{background: 'white', color: 'black'}}
                onClick={() => this.cancel()}>Cancel</button>          
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
    if (i == this.props.layerIndex) {
      this.props.changeLayerIndex(i - 1);
    }
  }
  down(i) {
    if (i == this.props.skin.length - 1) { return; }
    this.props.changeSkin(Skin.downLayer(this.props.skin, i));
    if (i == this.props.layerIndex) {
      this.props.changeLayerIndex(i + 1);
    }
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
    const r = confirm("レイヤーを削除しますか？");
    if (!r) { return; }
    this.props.changeSkin(Skin.deleteLayer(this.props.skin, i));
  }
  editLabel(i) {
    const oldLabel = this.props.skin.layers[i].label;
    const newLabel = window.prompt("名前の変更", oldLabel);
    if (newLabel === null) { return; }
    this.props.changeSkin(Skin.setLayerLabel(this.props.skin, i, newLabel));
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
      if (i == this.props.layerIndex) {
        rowStyle.fontWeight = 'bold';
      }

      const tdStyle = { padding: 0 };
      const labelStyle = {
        width: "12em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      };

      return (
        <tr style={rowStyle}>
          <td style={tdStyle}>
            <input type="checkbox" checked={l.visible} onClick={() => this.toggle(i)}/>
          </td>
          <td style={tdStyle} onClick={() => this.editLabel(i)}>
            {"\u{1F58B}"}
          </td>            
          <td style={tdStyle} onClick={() => this.props.changeLayerIndex(i)}>
            <div style={labelStyle}>{l.label}</div>
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
      <div>
        <Modal
          isOpen={this.state.isModalOpen}
          addLayer={this.addLayer.bind(this)}  
          close={this.closeModal.bind(this)}
        />
        <header onClick={() => this.showModal() }>新しいレイヤー</header>
        <table style={{ tableLayout: "fixed" }}>
          {items}
        </table>
      </div>
    );
  }
}

export default Layers;