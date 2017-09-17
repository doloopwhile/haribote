import React from 'react'
import Skin from './skin.jsx'
import LayerSpecs from './layer_specs.jsx'

const duplicatedPoint = function(p, i, arr) {
  for(let j = 0; j < i; ++j) {
    if (arr[j][0] == p[0] && arr[j][1] == p[1]) {
      return false;
    }
  }
  return true;
};
      
const EventHandlers = {
  pen: {
    onMouseDown: (this_, e) => {
      const p = this_.getPos(e);
      this_.setState({prevPos: p, drawingPixels: [p]});
    },
    onMouseMove: (this_, e) => {
      if (this_.state.prevPos == null) { return }
      const p = this_.getPos(e);
      let drawingPixels = this_.state.drawingPixels.concat(this_.pointsInLine(p, this_.state.prevPos));
      drawingPixels = drawingPixels.filter(duplicatedPoint);
      this_.setState({
        prevPos: p,
        drawingPixels: drawingPixels
      });
    },
    onMouseUp: (this_, e) => {
      this_.putPixels(this_.state.drawingPixels)
      this_.setState({prevPos: null, drawingPixels: [] })
    },
    onMouseLeave: (this_, e) => {
      this_.putPixels(this_.state.drawingPixels)
      this_.setState({prevPos: null, drawingPixels: [] })
    }
  },
  eraser: {
    onMouseDown: (this_, e) => {
      const p = this_.getPos(e);
      this_.setState({prevPos: p, erasingPixels: [p]});
    },
    onMouseMove: (this_, e) => {
      if (this_.state.prevPos == null) { return }
      const p = this_.getPos(e);
      let erasingPixels = this_.state.erasingPixels.concat(this_.pointsInLine(p, this_.state.prevPos))
      erasingPixels = erasingPixels.filter(duplicatedPoint);

      this_.setState({
        prevPos: p,
        erasingPixels: erasingPixels
      });
    },
    onMouseUp: (this_, e) => {
      this_.erasePixels(this_.state.erasingPixels)
      this_.setState({prevPos: null, erasingPixels: [] })
    },
    onMouseLeave: (this_, e) => {
      this_.erasePixels(this_.state.erasingPixels)
      this_.setState({prevPos: null, erasingPixels: [] })
    }
  },
  bucket: {
    onMouseDown: (this_, e) => {
      this_.fill(this_.getPos(e));
    },
    onMouseMove: (this_, e) => {},
    onMouseUp: (this_, e) => {},
    onMouseLeave: (this_, e) => {}
  },
  picker: {
    onMouseDown: (this_, e) => {
      const p = this_.getPos(e);
      const layerSpec = this_.layerSpec();
      const viewIndex = p[0] + p[1] * layerSpec.width;
      const imageIndex = layerSpec.viewToImageMapping[viewIndex];
      const rgb = this_.layer().data.slice(4 * imageIndex, 4 * imageIndex + 3);
      this_.props.changeColor(this_.props.colorIndex, rgb);
    },
    onMouseMove: (this_, e) => {},
    onMouseUp: (this_, e) => {},
    onMouseLeave: (this_, e) => {}
  }
}

const Toolbox = ({tool, changeTool}) => {
  const toolButtons = [
    ["pen", "assets/open-iconic/svg/pencil.svg"],
    ["eraser", "assets/open-iconic/svg/delete.svg"],
    ["bucket", "assets/open-iconic/svg/droplet.svg"],
    ["picker", "assets/open-iconic/svg/eyedropper.svg"]
  ].map((v) => {
    const style = { opacity: (tool == v[0]) ? 1 : 0.5 };
    return (
      <img
        width={32}
        height={32}
        src={v[1]}
        onClick={() => changeTool(v[0])}
        style={style}
      />
    );
  });
  return <div style={{fontSize: "32px"}}>{toolButtons}</div>
}

class ImageEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevPos: null,
      drawingPixels: [],
      erasingPixels: []
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp   = this.onMouseUp.bind(this);
    this.onMouseLeave= this.onMouseLeave.bind(this);
  }
  getPos(e) {
    let x = Math.floor(e.nativeEvent.offsetX / this.props.scale);
    let y = Math.floor(e.nativeEvent.offsetY / this.props.scale);

    const layerSpec = this.layerSpec();
    if (x < 0) { x = 0; }
    if (layerSpec.width <= x) { x = layerSpec.width - 1; }
    if (y < 0) { y = 0; }
    if (layerSpec.height <= y) { y = layerSpec.height - 1; }
    
    return [x, y];
  }
  pointsInLine(p, q) {
    const points = [];
    points.push(p);
    const m = Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
    for (var i = 1; i < m; i++) {
      points.push([
        Math.floor(((m - i) * p[0] + i * q[0]) / m),
        Math.floor(((m - i) * p[1] + i * q[1]) / m)
      ])
    }
    points.push(q);
    return points
  }
  putPixels(pixels) {
    this._putPixels(pixels, this.props.color.concat([255]));
  }
  erasePixels(pixels) {
    this._putPixels(pixels, [0, 0, 0, 0]);
  }
  _putPixels(pixels, rgba) {    
    const layerSpec = this.layerSpec();

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
  fill(p) {
    const skin = Skin.fill(
      this.props.skin,
      this.props.layerIndex,
      p,
      this.props.color
    );
    this.props.changeSkin(skin);
  }
  onMouseDown(e) {
    e.preventDefault();
    if (e.nativeEvent.which !== 1) { return }
    EventHandlers[this.props.tool].onMouseDown(this, e);
  }
  onMouseMove(e) {
    e.preventDefault();
    if (e.nativeEvent.which !== 1) { return }
    EventHandlers[this.props.tool].onMouseMove(this, e);
  }
  onMouseUp(e) {
    e.preventDefault();
    if (e.nativeEvent.which !== 1) { return }
    EventHandlers[this.props.tool].onMouseUp(this, e);
  }
  onMouseLeave(e) {
    e.preventDefault();
    if (e.nativeEvent.which !== 1) { return }
    EventHandlers[this.props.tool].onMouseLeave(this, e);
  }
  layerSpec() {
    return LayerSpecs[this.layer().kind];
  }
  layer() {
    const layerIndex = this.props.layerIndex;
    const skin  = this.props.skin;
    return skin.layers[layerIndex];
  }
  draw(canvas) {
    if (canvas == null) return;

    this.drawLayer(canvas);
    this.drawGrid(canvas);
  }

  drawLayer(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(128, 255, 255, 1)";
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
      const rgba = layer.data.slice(4 * imageIndex, 4 * imageIndex + 4)
      im.data.set(rgba, 4 * viewIndex);
    });

    const rgba = this.props.color.concat([255]);
    this.state.drawingPixels.forEach((p) => {
      const [x, y] = p;
      const i = x + y * layerSpec.width
      im.data.set(rgba, 4 * i);
    })
    const blank = [0, 0, 0, 0];
    this.state.erasingPixels.forEach((p) => {
      const [x, y] = p;
      const i = x + y * layerSpec.width
      im.data.set(blank, 4 * i);
    })
    layerContext.putImageData(im, 0, 0);
    ctx.drawImage(layerCanvas, 0, 0, scale * layerSpec.width, scale * layerSpec.height);
  }

  drawGrid(canvas) {
    const scale = this.props.scale;
    const skin = this.props.skin;
    const layer = skin.layers[this.props.layerIndex];
    const layerSpec = LayerSpecs[layer.kind];

    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#F88';
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

    ctx.strokeStyle = '#F00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    Object.keys(layerSpec.planes).forEach((key) => {      
      const p = layerSpec.planes[key];
      const v = layerSpec.viewMappings[key]
      
      const l = v.left * scale;
      const t = v.top * scale;
      const r = (v.left + p.width) * scale;
      const b = (v.top  + p.height) * scale;

      ctx.moveTo(l, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, b);
      ctx.lineTo(l, b);
      ctx.lineTo(l, t);
    });
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

    return (
      <div>
        <Toolbox tool={this.props.tool} changeTool={this.props.changeTool} />
        <canvas ref={(e) => this.draw(e)}
          width={this.width()}
          height={this.height()}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
          style={{
            background: 'lightgray',
            cursor: 'default',
            width: maxWidth * this.props + 'px',
            height: maxHeight * this.props + 'px'
          }}
        />
      </div>
    );
  }
}

export default ImageEdit;