import React from 'react'
import Skin from './skin.jsx'
import ReactModal from "react-modal"

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <ReactModal 
        isOpen={this.props.isOpen}
        contentLabel="Minimal Modal Example"
      >
        <button onClick={this.props.close}>Close Modal</button>
      </ReactModal>
    );
  }
}

  // render() {
  //   const style = {
  //     zIndex: 2,
  //     background: '#FFF',
  //     padding: '2px 1em',
  //     margin: 'auto',
  //     width: '500px',
  //     height: '500px',
  //     borderTop: '1px solid #2196f3',
  //     borderBottom: '1px solid #2196f3',
  //   };

  //   const overlayStyle = {
  //     zIndex: 1,
  //     position: 'fixed',
  //     padding: '1em',
  //     top: 0,
  //     left: 0,
  //     width: '100%',
  //     height: '120%',
  //     background: 'rgba(255, 255, 255, 0.75)'
  //   };

  //   return (
  //     <div style={overlayStyle}>
  //       <div style={style}>
  //         <h2>新しいパーツの追加</h2>
          
  //         <label>名前:</label>
  //         <input type={"text"} />
  //         <hr style={{"margin": "16px 0"}}/>
          
  //         <label>種類:</label>
  //         <table style={{width: "100%"}}>
  //           <tr>
  //             <td>
  //               <label style={{display: "block"}}>
  //                 <input type={"radio"} name={"kind"} value={"head"} />
  //                 頭
  //               </label>
  //             </td>
  //             <td>
  //               <label style={{display: "block"}}>
  //                 <input type={"radio"} name={"kind"} value={"head_wear"} />
  //                 頭（服）
  //               </label>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>
  //               <label style={{display: "block"}}>
  //                 <input type={"radio"} name={"kind"} value={"upper_body"} />
  //                 胴体と腕
  //               </label>
  //             </td>
  //             <td>
  //               <label style={{display: "block"}}>
  //                 <input type={"radio"} name={"kind"} value={"upper_body_wear"} />
  //                 胴と腕（服）
  //               </label>
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>
  //               <label style={{display: "block"}}>
  //                 <input type={"radio"} name={"kind"} value={"lower_body"} />
  //                 脚
  //               </label>
  //             </td>
  //             <td>
  //               <label style={{display: "block"}}>
  //                 <input type={"radio"} name={"kind"} value={"lower_body_wear"} />
  //                 脚（服）
  //               </label>
  //             </td>
  //           </tr>
  //         </table>
  //         <button>OK</button>
  //         &nbsp;
  //         <button style={{background: 'white', color: 'black'}}>Cancel</button>          
  //       </div>
  //     </div>
  //   );
  // }


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