import React from 'react'
import CsrfField from './csrf_field.jsx'
import LayerSpecs from './layer_specs.jsx'

const PngSaveForm = (props) => {
  const onClick = () => {
    const skin = props.skin;
    const canvas = document.createElement("canvas");
    canvas.width = skin.width;
    canvas.height = skin.height;
    const div = document.getElementById("save_form_canvas");

    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = 'destination-over';

    const layers = Array.from(props.skin.layers);
    layers.forEach((layer) => {
      if (!layer.visible) { return; }
      const layerCanvas = document.createElement('canvas');
      layerCanvas.height = skin.height;
      layerCanvas.width  = skin.width;
      const layerContext = layerCanvas.getContext("2d");
      const layerSpec = LayerSpecs[layer.kind];
      const im = layerContext.createImageData(skin.width, skin.height);
      im.data.set(layer.data);
      Object.values(layerSpec.planes).forEach((p) => {
        layerContext.putImageData(im, 0, 0, p.left, p.top, p.width, p.height);        
      });        
      ctx.drawImage(layerCanvas, 0, 0);
    });
    div.appendChild(canvas);

    window.open(canvas.toDataURL());
  };

  return (
    <form>
      <CsrfField />
      <button type={"button"} onClick={onClick}>PNG</button>
      <div id="save_form_canvas" />
    </form>
  );
};

class ZipSaveForm extends React.Component {
  render() {
    return (
      <form target="_blank">
        <CsrfField />
        <input type="hidden" name={"name"} value={this.props.skin} />
        <input type={"submit"} value="ZIP" />
      </form>
    );
  }
};

const SaveForm = (props) => {
  return (
    <div>
      <PngSaveForm skin={props.skin}/>
      <ZipSaveForm skin={props.skin}/>
    </div>
  )
}

export default SaveForm;