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
import ColorPicker from './color_picker.jsx'


class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skin: props.skin,
      colors: props.colors,
      colorIndex: 0,
      layerIndex: 0,
      tool: "pen"
    }
  }
  changeSkin(skin) {
    this.setState({skin: skin})
  }
  changeColor(i, color) {
    const colors = Array.from(this.state.colors);
    colors[i] = color;
    console.log([i, colors[i]]);
    this.setState({ colors: colors });    
  }
  changeColorIndex(i) {
    this.setState({ colorIndex: i });
  }
  changeLayerIndex(i) {
    this.setState({ layerIndex: i });
  }
  changeTool(tool) {
    this.setState({ tool: tool });
  }
  render() {
    const color = this.state.colors[this.state.colorIndex];

    let edit = [];
    if (this.state.layerIndex != null) {
      edit = [
        <ImageEdit
          skin={this.state.skin}
          color={color}
          colorIndex={this.state.colorIndex}
          tool={this.state.tool}
          changeTool={this.changeTool.bind(this)}
          layerIndex={this.state.layerIndex}
          changeSkin={this.changeSkin.bind(this)}
          changeColor={this.changeColor.bind(this)}
          scale={16}
        />,
      ];
    }

    return (
      <div>
        <SaveForm skin={this.state.skin} />
        <Preview skin={this.state.skin} />
        <div>
          <div style={{float: 'left', width: '50%'}}>
            <Layers
              skin={this.state.skin}
              layerIndex={this.state.layerIndex}
              changeLayerIndex={this.changeLayerIndex.bind(this)}
              changeSkin={this.changeSkin.bind(this)}
            />
          </div>
          <div style={{float: 'left', width: '30%'}}>
            <Palette
              colors={this.state.colors}
              colorIndex={this.state.colorIndex}
              changeColorIndex={this.changeColorIndex.bind(this)}
              changeColor={this.changeColor.bind(this)}
            />
          </div>
          <div style={{float: 'left', width: '20%'}}>
            <ColorPicker
              colors={this.state.colors}
              colorIndex={this.state.colorIndex}
              changeColor={this.changeColor.bind(this)}
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
