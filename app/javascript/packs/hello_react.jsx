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
import Toolbox from './toolbox.jsx'
import LabelEdit from './label_edit.jsx'


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skin: props.skin
    }
  }
  changeSkin(skin) {
    this.setState({ skin: skin });
  }
  render() {
    if (this.state.skin == null) {
      return <SkinUploadForm changeSkin={this.changeSkin.bind(this)}/>
    } else {
      return <Editor
        skin={this.state.skin}
        colors={this.props.colors}
      />;
    }
  }
}

const SkinUploadForm = ({changeSkin}) => {
  const ref = (element) => {
    if (element == null) { return; }

    $(element).submit((event) => {
      event.preventDefault();
      
      var formdata = new FormData($(element).get(0));
      $.ajax({
        url: Routes.api_parsing_png_path('json'),
        method: 'POST',
        data: formdata,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json"
      }).done((data, textStatus, jqXHR) =>{
        changeSkin(data.skin);
      });
    });
  }

  return <form ref={ref}>
    <input type="file" name="file"/>
    <p>
      <input type="submit" />
    </p>
  </form>;
}

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
    this.setState({skin: skin});
  }
  changeColor(i, color) {
    const colors = Array.from(this.state.colors);
    colors[i] = color;
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
        <LabelEdit 
          layerIndex={this.state.layerIndex}
          changeSkin={this.changeSkin.bind(this)}
          skin={this.state.skin}
        />
        <Toolbox 
          tool={this.state.tool}
          changeTool={this.changeTool.bind(this)}
        />
        <ImageEdit
          skin={this.state.skin}
          tool={this.state.tool}
          color={color}
          colorIndex={this.state.colorIndex}  
          layerIndex={this.state.layerIndex}
          changeSkin={this.changeSkin.bind(this)}
          changeColor={this.changeColor.bind(this)}
          scale={28}
        />
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('editor')
  const props = JSON.parse(node.dataset.props)
  ReactDOM.render(<Main skin={props.skin} colors={props.colors}/>, node)
})
