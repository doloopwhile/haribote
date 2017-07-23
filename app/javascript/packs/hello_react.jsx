import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import Preview from './preview.jsx'
import Palette from './palette.jsx'
import Layers from './layers.jsx'
import Skin from './skin.jsx'
import ImageEdit from './image_edit.jsx'


const CsrfField = props => {
  const token = document.querySelector("head > meta[name=csrf-token]").content
  const name = document.querySelector("head > meta[name=csrf-param]").content
  return <input type={"hidden"} value={token} name={name} />
}

const SaveForm = props => (
  <form action={Routes.editor_path()} method={"POST"}>
    <CsrfField />
    <input type={"hidden"} name={"skin"} value={JSON.stringify(props.skin)} />
  
    <input type={"text"} name={"name"} />
    <input type={"submit"} />
  </form>
)


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
  // ReactDOM.render(<Preview skin={props.skin} />, node)
})
