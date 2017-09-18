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
import ScaleSelector from './scale_selector.jsx'


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
      return this.renderTopPage();
    } else {
      return <Editor
        skin={this.state.skin}
        colors={this.props.colors}
        mode={this.props.mode}
      />;
    }
  }

  renderTopPage() {
    const imageStyle = {
      filter: 'blur(2px)',
      height: '200px'
    }

    const h2Style = {
      borderBottom: "1px solid lightgray"
    }

    return <div>
      <h1>Haribote - Minecraft skin editor</h1>
      <div style={{textAlign: "center" }}>
        <a href={Routes.editor_path() + "?template=steve"}>
          <img style={imageStyle} src={"/img/screenshot1.png"} />
          <img style={imageStyle} src={"/img/screenshot2.png"} />
        </a>
      </div>

      <h2 style={h2Style}>Try it out!</h2>
      <a href={Routes.editor_path() + "?template=steve"}>
        <img src={"/img/steve_face128.png"} width={128} height={128}/>
      </a>

      <h2 style={h2Style}>Edit your .png file</h2>
      <img
        style={{ border: "1px solid lightgray", background: "#F8F", marginRight: "1em" }}
        src={"/img/steve_skin128.png"} width={128} height={128}/>
      <PngUploadForm changeSkin={this.changeSkin.bind(this)}/>
      
      <h2 style={h2Style}>Edit your .zip file</h2>
      <ZipUploadForm changeSkin={this.changeSkin.bind(this)}/>
    </div>;
  }
}

const PngUploadForm = ({changeSkin}) => {
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

  return <form ref={ref} style={{ verticalAlign: "top", display: "inline-block"}} >
    <p><input type="file" name="file"/></p>
    <p><input type="submit" /></p>
  </form>;
}

const ZipUploadForm = ({changeSkin}) => {
  const ref = (element) => {
    if (element == null) { return; }

    $(element).submit((event) => {
      event.preventDefault();
      
      var formdata = new FormData($(element).get(0));
      $.ajax({
        url: Routes.api_parsing_zip_path('json'),
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
    <p><input type="file" name="file"/></p>
    <p><input type="submit" /></p>
  </form>;
}


const CloseButton = ({closeEditor}) => {
  const style = {
    width: "32px",
    height: "32px",
    verticalAlign: "middle"
  };
  return (
    <img
      src={"assets/open-iconic/svg/arrow-thick-left.svg"}
      style={style}
      onClick={closeEditor}
    />
  );
}

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skin: props.skin,
      colors: props.colors,
      colorIndex: 0,
      layerIndex: 0,
      tool: "pen",
      scale: 16,
      mode: this.props.mode
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
  editLayer(i) {
    this.setState({ layerIndex: i, isEditorOpen: true });
  }
  closeEditor() {
    this.setState({ isEditorOpen: false });
  }
  changeTool(tool) {
    this.setState({ tool: tool });
  }
  changeScale(scale) {
    this.setState({scale: scale});
  }
  render() {
    if (this.state.mode == "SP") {
      if (this.state.isEditorOpen) {
        return this.renderEditor();
      } else {
        return <div>
          {this.renderPreview()}
          {this.renderModeSelector()}
        </div>;
      }
    } else {
      return (<div>
        {this.renderPreview()}
        {this.renderEditor()}
        {this.renderModeSelector()}
      </div>);
    }
  }

  renderEditor() {
    let closeButton = null;
    if (this.state.mode == "SP") {
      closeButton = <CloseButton closeEditor={this.closeEditor.bind(this)} />
    }

    return <div>
      <div>
        {closeButton}

        <LabelEdit 
          layerIndex={this.state.layerIndex}
          changeSkin={this.changeSkin.bind(this)}
          skin={this.state.skin}
        />
        <Toolbox 
          tool={this.state.tool}
          changeTool={this.changeTool.bind(this)}
        />
        <ScaleSelector
          scale={this.state.scale}
          changeScale={this.changeScale.bind(this)}
        />
      </div>
      <div style={{ paddingLeft: "8px"}}>
        <ImageEdit
          skin={this.state.skin}
          tool={this.state.tool}
          color={ this.state.colors[this.state.colorIndex]}
          colorIndex={this.state.colorIndex}  
          layerIndex={this.state.layerIndex}
          changeSkin={this.changeSkin.bind(this)}
          changeColor={this.changeColor.bind(this)}
          scale={this.state.scale}
        />
        <Palette
          colors={this.state.colors}
          colorIndex={this.state.colorIndex}
          changeColorIndex={this.changeColorIndex.bind(this)}
          changeColor={this.changeColor.bind(this)}
          colCount={4}
          rowCount={8}
        />
      </div>
    </div>
  }

  renderPreview() {
    return (
      <div>
        <div style={{ padding: "8px" }}>
          <SaveForm skin={this.state.skin} />
        </div>
        <Preview skin={this.state.skin} />
        <span style={{ padding: "8px" }}></span>
        <Layers
          skin={this.state.skin}
          editLayer={this.editLayer.bind(this)}
          changeSkin={this.changeSkin.bind(this)}
          changeLayerIndex={this.changeLayerIndex.bind(this)}
        />
      </div>
    );
  }

  renderModeSelector() {
    return (
      <div style={{ textAlign: "right"}}>
        <label onClick={() => this.setState({mode: "PC"})}>
          <input type={"radio"} name="mode"
            checked={this.state.mode == "PC" }/>
          PC
        </label>
        &nbsp; &nbsp;
        <label onClick={() => this.setState({mode: "SP"})}>
        <input type={"radio"} name="mode"
          checked={this.state.mode == "SP" }/>
          SP
        </label>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('editor')
  const props = JSON.parse(node.dataset.props);

  ReactDOM.render(
    <Main
      skin={props.skin}
      colors={props.colors}
      mode={props.mode}  
    />,
    node
  );
})
