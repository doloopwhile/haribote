import React from 'react'
import Skin from './skin.jsx'
import LayerSpecs from './layer_specs.jsx'




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
  draw(canvas) {
    if (canvas == null) return;

    this.drawLayer(canvas);
    this.drawGrid(canvas);
  }

  drawLayer(canvas) {
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

    const data = Array.from(im.data);
    Object.entries(layerSpec.viewToImageMapping).forEach((entry) => {
      const [viewIndex, imageIndex] = entry;
      data[4 * viewIndex + 0] = layer.data[4 * imageIndex + 0];
      data[4 * viewIndex + 1] = layer.data[4 * imageIndex + 1];
      data[4 * viewIndex + 2] = layer.data[4 * imageIndex + 2];
      data[4 * viewIndex + 3] = layer.data[4 * imageIndex + 3];
    });
    im.data.set(data);

    layerContext.putImageData(im, 0, 0);
    ctx.drawImage(layerCanvas, 0, 0, scale * layerSpec.width, scale * layerSpec.height);
  }

  drawGrid(canvas) {
    const scale = this.props.scale;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#FF0000';
    ctx.beginPath();

    const w = this.width();
    const h = this.height();
    for(var x = scale; x < w; x += scale) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for(var y = scale; y < h; y += scale) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  }
  width() {
    return this.props.scale * this.layerSpec().width;
  }
  height() {
    return this.props.scale * this.layerSpec().height;
  }

  render() {
    let maxWidth = 0;
    let maxHeight = 0;
    Object.values(LayerSpecs).forEach((s) => {
      maxWidth  = Math.max(maxWidth, s.width);
      maxHeight = Math.max(maxHeight, s.height);
    });
    const style = {
      background: 'lightgray',
      cursor: 'default',
      width: maxWidth * this.props + 'px',
      height: maxHeight * this.props + 'px'
    };
    return (
      <div>
        <div>{this.props.skin.layers[this.props.layerIndex].label}</div>
        <canvas ref={(e) => this.draw(e)}
          width={this.width()}
          height={this.height()}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
          style={style}
        />
      </div>
    );
  }
}

export default ImageEdit;