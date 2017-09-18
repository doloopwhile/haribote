import React from 'react'
import CsrfField from './csrf_field.jsx'
import LayerSpecs from './layer_specs.jsx'

const PngSaveForm = (props) => {
  const onClick = () => {
    const skin = props.skin;
    const canvas = document.createElement("canvas");
    canvas.width = skin.width;
    canvas.height = skin.height;

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

    window.open(canvas.toDataURL());
  };

  return (
    <button type={"button"} onClick={onClick}>Download PNG</button>
  );
};

const ZipSaveForm = (props) => {
  return (
    <form
      action={Routes.api_saving_zip_path()}
      method={"POST"}
      style={{ display: "inline-block" }}
    >
      <CsrfField />
      <input type={"hidden"} value={JSON.stringify(props.skin)} name={"skinJSON"} />
      <button type={"submit"}>Download ZIP</button>
    </form>
  );
};

const SaveForm = (props) => {
  return (
    <div>
      <PngSaveForm skin={props.skin}/>
      <span style={{marginRight: "0.5em"}} />
      <ZipSaveForm skin={props.skin}/>
      <span style={{marginRight: "0.5em"}} />
      <a href={"https://minecraft.net/ja-jp/profile/"}
        target="_blank">
        Change your skin
      </a>
    </div>
  )
}

export default SaveForm;