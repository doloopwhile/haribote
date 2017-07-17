import React from 'react'
import Skin from './skin.jsx'

const LayerSpecs = {
  head: {
    width: 32,
    height: 16,
    mappings: [
      { viewLeft: 8, viewTop: 0, imageLeft: 8, imageTop: 0, width: 16,  height: 8 },
      { viewLeft: 0, viewTop: 8, imageLeft: 0, imageTop: 8, width: 32, height: 8 }
    ]
  },
  upper_body: {
    width: 32,
    height: 16,
    mappings: [
    ]
  },
  lower_body: {
    width: 32,
    height: 16,
    mappings: [
    ]
  },
  head_wear: {
    width: 32,
    height: 16,
    mappings: []
  },
  upper_body_wear: {
    width: 32,
    height: 16,
    mappings: []
  },
  lower_body_wear: {
    width: 32,
    height: 16,
    mappings: []
  }
};

const posToIndex = (x, y, w) => (x + y * w)

Object.keys(LayerSpecs).forEach((key) => {
  const spec = LayerSpecs[key];
  spec.viewToImageMapping = {};
  spec.imageToViewMapping = {};
  
  spec.mappings.forEach((m) => {
    for(let y = 0; y < m.height; y++) {
      for(let x = 0; x < m.width; x++) {
        const viewIndex  = posToIndex(m.viewLeft + x, m.viewTop + y, spec.width);
        const imageIndex = posToIndex(m.imageLeft + x, m.imageTop + y, Skin.width);
        spec.viewToImageMapping[viewIndex] = imageIndex;
        spec.imageToViewMapping[imageIndex] = viewIndex;
      }    
    }
  });
});



const drawGrid = (ctx, scale, w, h) => {
  const gridCanvas = document.createElement('canvas');
  gridCanvas.width  = w;
  gridCanvas.height = h;

  const gridContext = gridCanvas.getContext('2d');

  gridContext.strokeStyle = '#FF0000';
  gridContext.beginPath();
  for(var x = scale; x < w; x += scale) {
    gridContext.moveTo(x, 0);
    gridContext.lineTo(x, h);
  }
  for(var y = scale; y < h; y += scale) {
    gridContext.moveTo(0, y);
    gridContext.lineTo(w, y);
  }
  gridContext.stroke();

  ctx.drawImage(gridCanvas, 0, 0);
}


class ImageEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { prevPos: null };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp   = this.onMouseUp.bind(this);
    this.onMouseLeave= this.onMouseLeave.bind(this);
  }

  putPixels(pixels) {
    const layerSpec = this.layerSpec();
    const rgba = this.props.color.concat([255]);

    const skinPixels = pixels.map((e) => {
      let [x, y] = e;
      const viewIndex = x + y * layerSpec.width;
      const imageIndex = layerSpec.viewToImageMapping[viewIndex];
      return [imageIndex, rgba];
    });
    const skin = Skin.putPixels(
      this.props.skin,
      this.props.layerIndex,
      skinPixels
    );

    this.props.changeSkin(skin);
  }
  onMouseDown(e) {
    e.preventDefault();
    if (e.nativeEvent.which !== 1) { return }
    const x = Math.floor(e.nativeEvent.offsetX / this.props.scale);
    const y = Math.floor(e.nativeEvent.offsetY / this.props.scale);
    this.setState({prevPos: [x, y]});
    this.putPixels([[x, y]]);
  }
  onMouseMove(e) {
    e.preventDefault();
    if (this.state.prevPos == null) { return }
    if (e.nativeEvent.which !== 1) { return }

    const x = Math.floor(e.nativeEvent.offsetX / this.props.scale)
    const y = Math.floor(e.nativeEvent.offsetY / this.props.scale)

    const px = this.state.prevPos[0]
    const py = this.state.prevPos[1]

    const pixels = []
    pixels.push([x, y])
    const m = Math.abs(x - px) + Math.abs(y - py)
    for (var i = 1; i < m; i++) {
      const x1 = Math.floor(((m - i) * x + i * px) / m)
      const y1 = Math.floor(((m - i) * y + i * py) / m)
      pixels.push([x1, y1])        
    }
    pixels.push([px, py])

    this.setState({prevPos: [x, y]})
    this.putPixels(pixels)
  }
  onMouseUp(e) {
    if (e.nativeEvent.which !== 1) { return }
    this.setState({prevPos: null})
  }
  onMouseLeave(e) {
    if (e.nativeEvent.which !== 1) { return }
    this.setState({prevPos: null})
  }
  layerSpec() {
    const layerIndex = this.props.layerIndex;
    const skin  = this.props.skin;
    const layer = skin.layers[layerIndex];
    return LayerSpecs[layer.kind];
  }
  drawLayer(canvas) {
    if (canvas == null) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(255, 0, 255, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    
    const scale = this.props.scale;
    const skin = this.props.skin;
    const layer = skin.layers[this.props.layerIndex];
    const layerSpec = LayerSpecs[layer.kind];

    const layerCanvas = document.createElement('canvas');
    layerCanvas.height = layerSpec.height;
    layerCanvas.width  = layerSpec.width;

    const layerContext = layerCanvas.getContext('2d');
    const im = layerContext.createImageData(layerSpec.width, layerSpec.height);

    Object.entries(layerSpec.viewToImageMapping).forEach((entry) => {
      const [viewIndex, imageIndex] = entry;
      im.data[4 * viewIndex + 0] = layer.data[4 * imageIndex + 0];
      im.data[4 * viewIndex + 1] = layer.data[4 * imageIndex + 1];
      im.data[4 * viewIndex + 2] = layer.data[4 * imageIndex + 2];
      im.data[4 * viewIndex + 3] = layer.data[4 * imageIndex + 3];
    });

    layerContext.putImageData(im, 0, 0);
    ctx.drawImage(layerCanvas, 0, 0, scale * layerSpec.width, scale * layerSpec.height);
  
  }

  render() {
    const style = {
      width: (64 * this.props.scale) + 'px',
      height: (64 * this.props.scale) + 'px',
      border: '1px solid black',
      background: 'lightgray',
      margin: '10px',
      cursor: 'default'
    };
    
    return (
      <div style={style}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
      >
        <canvas ref={this.drawLayer.bind(this)}
          width={this.props.scale * this.layerSpec().width}
          height={this.props.scale * this.layerSpec().height}
        />
      </div>
    );
  }
}

export default ImageEdit;