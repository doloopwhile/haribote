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

  render() {
    const items = this.props.skin.layers.map((l, i) => {
      const buttonStyle = {
        padding: '0 16px',
      };

      const rowStyle = {
        borderBottom: "1px solid #ccc",
        display: 'grid'
      };
      if (!l.visible) {
        rowStyle.color = "#888";
      }
      if (i == this.props.layerIndex) {
        rowStyle.fontWeight = 'bold';
      }

      const labelStyle = {
        width: '16em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        gridColumn: 2
      };

      return (
        <div style={rowStyle}>
          <div style={{gridColumn: 1}}>
            <input type="checkbox" checked={l.visible} onClick={() => this.toggle(i)}/>
          </div>
          <div style={labelStyle} onClick={() => this.props.changeLayerIndex(i)}>
            {l.label}
          </div>
          <div style={{gridColumn: 3}}>
            <button style={buttonStyle} onClick={() => this.down(i)} disabled={i == this.props.skin.layers.length - 1}>↓</button>
            <button style={buttonStyle} onClick={() => this.up(i)} disabled={i == 0}>↑</button>
          </div>
        </div>
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
        <div>{items}</div>
      </div>
    );
  }
}

export default Layers;