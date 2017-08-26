import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import Preview from './preview.jsx'
import Palette from './palette.jsx'
import Layers from './layers.jsx'
import Skin from './skin.jsx'
import ImageEdit from './image_edit.jsx'
import SaveForm from './save_form.jsx'


class NewLayerModal extends React.Component {
  render() {
    const style = {
      zIndex: 2,
      background: '#FFF',
      padding: '2px 1em',
      margin: 'auto',
      width: '500px',
      height: '500px',
      borderTop: '1px solid #2196f3',
      borderBottom: '1px solid #2196f3',
    };

    const overlayStyle = {
      zIndex: 1,
      position: 'fixed',
      padding: '1em',
      top: 0,
      left: 0,
      width: '100%',
      height: '120%',
      background: 'rgba(255, 255, 255, 0.75)'
    };

    return (
      <div style={overlayStyle}>
        <div style={style}>
          <h2>新しいパーツの追加</h2>
          
          <label>名前:</label>
          <input type={"text"} />
          <hr style={{"margin": "16px 0"}}/>
          
          <label>種類:</label>
          <table style={{width: "100%"}}>
            <tr>
              <td>
                <label style={{display: "block"}}>
                  <input type={"radio"} name={"kind"} value={"head"} />
                  頭
                </label>
              </td>
              <td>
                <label style={{display: "block"}}>
                  <input type={"radio"} name={"kind"} value={"head_wear"} />
                  頭（服）
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label style={{display: "block"}}>
                  <input type={"radio"} name={"kind"} value={"upper_body"} />
                  胴体と腕
                </label>
              </td>
              <td>
                <label style={{display: "block"}}>
                  <input type={"radio"} name={"kind"} value={"upper_body_wear"} />
                  胴と腕（服）
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label style={{display: "block"}}>
                  <input type={"radio"} name={"kind"} value={"lower_body"} />
                  脚
                </label>
              </td>
              <td>
                <label style={{display: "block"}}>
                  <input type={"radio"} name={"kind"} value={"lower_body_wear"} />
                  脚（服）
                </label>
              </td>
            </tr>
          </table>
          <button>OK</button>
          &nbsp;
          <button style={{background: 'white', color: 'black'}}>Cancel</button>          
        </div>
      </div>
    );
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.changeColorIndex = this.changeColorIndex.bind(this);
    this.changeLayerIndex = this.changeLayerIndex.bind(this);
    this.changeSkin = this.changeSkin.bind(this);

    this.state = {
      skin: props.skin,
      colors: props.colors,
      colorIndex: 0,
      layerIndex: 0
    }
  }
  changeSkin(skin) {
    this.setState({skin: skin})
  }
  changeColorIndex(i) {
    this.setState({ colorIndex: i });
  }
  changeLayerIndex(i) {
    this.setState({ layerIndex: i });
  }

  render() {
    const color = this.state.colors[this.state.colorIndex];

    let edit = [];
    if (this.state.layerIndex != null) {
      edit = [
        <ImageEdit
          skin={this.state.skin}
          color={color}
          layerIndex={this.state.layerIndex}
          changeSkin={this.changeSkin.bind(this)}
          scale={16}
        />,
      ];
    }

    return (
      <div>
        <NewLayerModal />
        <SaveForm skin={this.state.skin} />
        <Preview skin={this.state.skin} /> 
        <div>
          <div style={{float: 'left', width: '50%'}}>
            <Layers
              skin={this.state.skin}
              layerIndex={this.state.layerIndex}
              changeLayerIndex={this.changeLayerIndex}
              changeSkin={this.changeSkin}
            />
          </div>
          <div style={{float: 'left', width: '50%'}}>
            <Palette
              colors={this.state.colors}
              colorIndex={this.state.colorIndex}
              changeColorIndex={this.changeColorIndex}
            />
          </div>
        </div>
        <hr />
        {edit}
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('editor')
  const props = JSON.parse(node.dataset.props)

  ReactDOM.render(<Editor skin={props.skin} colors={props.colors}/>, node)
})
