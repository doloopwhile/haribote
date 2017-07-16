import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Immutable from 'immutable'



const copyArrayElements = (arrDst, arrSrc) => {
  for(var k = 0; k < arrSrc.length; ++k) {
    arrDst[k] = arrSrc[k];
  }
}

const PaletteView = props => {
  const colors = props.colors;
  const colorIndex = props.colorIndex;
  const rowCount = 8;
  const colCount = 6;

  const rows = [];
  const indexes = [];
  let i = 0;
  for (var y = 0; y < rowCount; ++y) {
    const cols = [];
    for (var x = 0; x < colCount; ++x) {
      cols.push(i);
      ++i;
    }
    rows.push(cols);
  }

  return <table className="palette">
    {
      rows.map(function(cols) {
        return <tr>
          {
            cols.map(function(i) {
              const style = {
                backgroundColor: "rgb(" + colors[i][0] + "," + colors[i][1] + "," + colors[i][2] + ")"
              };
              if (i == colorIndex) {
                style.borderColor = 'black'
              }
              
              return <td
                style={style}
                onClick={() => props.changeColorIndex(i)}
              >{i}</td>;
            })
          }
        </tr>
      })
    }
  </table>;
}

const ImageView = props => {
  const skin = props.skin;
  const scale = props.scale;
  const h = scale * skin.height;
  const w = scale * skin.width;

  const refs = (element) => {
    if (element == null) { return; }

    const ctx = element.getContext('2d');
    ctx.fillStyle = "rgba(255, 0, 255, 1)";
    ctx.fillRect(0, 0, w, h);

    ctx.imageSmoothingEnabled = false;
    
    for(let i = skin.layers.length - 1; i >= 0; --i) {
      const l = skin.layers[i];
      if (!l.visible) { continue; }

      const layerCanvas = document.createElement('canvas');
      layerCanvas.height = skin.height;
      layerCanvas.width  = skin.width;

      const layerContext = layerCanvas.getContext('2d');
      const im = layerContext.createImageData(skin.width, skin.height);
      copyArrayElements(im.data, l.data)
      layerContext.putImageData(im, 0, 0);

      ctx.drawImage(layerCanvas, 0, 0, w, h);
    }

    if (props.rendersGrid) {
      const gridCanvas = document.createElement('canvas');
      gridCanvas.width  = element.width;
      gridCanvas.height = element.height;
      
      const gridContext = gridCanvas.getContext('2d');

      gridContext.strokeStyle = '#FF0000';
      gridContext.beginPath();
      for(var x = 1; x < skin.width; ++x) {
        gridContext.moveTo(x * scale, 0);
        gridContext.lineTo(x * scale, skin.height * scale);
      }
      for(var y = 1; y < skin.height; ++y) {
        gridContext.moveTo(0,                  y * scale);
        gridContext.lineTo(skin.width * scale, y * scale);
      }
      gridContext.stroke();

      ctx.drawImage(gridCanvas, 0, 0);
    }
  }

  return <canvas ref={refs} width={w} height={h} />;
}

const Preview = props => {
  const style = {
    width: '64px',
    height: '64px',
    border: '1px solid black',
    background: 'lightgray',
    margin: '10px',
    cursor: 'default'
  };
  return (
    <div style={style}>
      <ImageView scale={1} skin={props.skin}/>
    </div>
  )
}

const Skin = {
  putPixels(skin, i, pixels) {
    const data = Array.from(skin.layers[i].data);
    pixels.forEach((item) => {
      const x = item[0]
      const y = item[1]
      const rgba = item[2]
      const i = 4 * (x + y * skin.width)
      data[i]     = rgba[0];
      data[i + 1] = rgba[1];
      data[i + 2] = rgba[2];
      data[i + 3] = rgba[3];
    });
    const layers = Array.from(skin.layers);
    layers[i] = Object.assign(layers[i], { data: data });
    return Object.assign(skin, { layers: layers });
  },
  upLayer(skin, i) {
    if (i == 0) {
      return skin;
    }
    const layers = Array.from(skin.layers);
    const upper = layers[i - 1];
    layers[i - 1] = layers[i];
    layers[i] = upper;
    return Object.assign(skin, { layers: layers });
  },
  downLayer(skin, i) {
    if (i == skin.layers.length - 1) {
      return skin;
    }
    const layers = Array.from(skin.layers);
    const lower = layers[i + 1];
    layers[i + 1] = layers[i];
    layers[i] = lower;
    return Object.assign(skin, { layers: layers });
  },
  toggleLayer(skin, i) {
    const layers = Array.from(skin.layers);
    layers[i] = Object.assign(layers[i], { visible: !layers[i].visible });
    return Object.assign(skin, { layers: layers });
  },
  unshiftNewLayer(skin, label) {
    const layers = Array.from(skin.layers);
    const data = (new Array(skin.width * skin.height * 4)).map(function() { return 0; });
    layers.unshift({ label: label, visible: true, data: data });
    return Object.assign(skin, { layers: layers });    
  }
}

class ImageEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      prevPos: null,
      scale: 20
    }

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp   = this.onMouseUp.bind(this);
    this.onMouseLeave= this.onMouseLeave.bind(this);
  }

  putPixels(pixels) {
    const skin = Skin.putPixels(
      this.props.skin,
      this.props.layerIndex,
      pixels
    )
    this.props.changeSkin(skin)   
  }

  onMouseDown(e) {
    e.preventDefault();
    if (e.nativeEvent.which !== 1) { return }
    const x = Math.floor(e.nativeEvent.offsetX / this.state.scale)
    const y = Math.floor(e.nativeEvent.offsetY / this.state.scale)

    this.setState({prevPos: [x, y]})
    this.putPixels([[x, y, this.rgba()]])
  }
  
  onMouseMove(e) {
    e.preventDefault();
    if (this.state.prevPos == null) { return }
    if (e.nativeEvent.which !== 1) { return }

    const x = Math.floor(e.nativeEvent.offsetX / this.state.scale)
    const y = Math.floor(e.nativeEvent.offsetY / this.state.scale)

    const px = this.state.prevPos[0]
    const py = this.state.prevPos[1]

    const pixels = []
    pixels.push([x, y, this.rgba()])
    const m = Math.abs(x - px) + Math.abs(y - py)
    for (var i = 1; i < m; i++) {
      const x1 = Math.floor(((m - i) * x + i * px) / m)
      const y1 = Math.floor(((m - i) * y + i * py) / m)
      pixels.push([x1, y1, this.rgba()])        
    }
    pixels.push([px, py, this.rgba()])

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
  rgba() {
    return this.props.color.concat([255]);
  }
  render() {
    const style = {
      width: (64 * this.state.scale) + 'px',
      height: (64 * this.state.scale) + 'px',
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
        <p>{JSON.stringify(this.rgba())}</p>
        <p>{JSON.stringify(this.props.color)}</p>
        <ImageView
          skin={this.props.skin}
          scale={this.state.scale}
          rendersGrid={true}
        />
      </div>
    );
  }
}

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

const LayerEdit = (props) => {
  const up = (i) => {
    if (i == 0) { return; }
    props.changeSkin(Skin.upLayer(props.skin, i), i - 1);
    props.changeLayerIndex(i - 1);
  };
  const down = (i) => {
    if (i == props.skin.length - 1) { return; }
    props.changeSkin(Skin.downLayer(props.skin, i));
    props.changeLayerIndex(i + 1);
  };
  const toggle = (i) => {
    props.changeSkin(Skin.toggleLayer(props.skin, i));
  };
  const add = () => {
    const label = prompt("新しいレイヤーの名前を入力してください", "");
    if (label == null) { return; }
    props.changeSkin(Skin.unshiftNewLayer(props.skin, label));
  };

  const items = props.skin.layers.map(function(l, i) {
    return (
        <div style={{borderBottom: "1px solid #ccc"}}>
          <input type="radio" checked={i == props.layerIndex}
                onClick={() => props.changeLayerIndex(i)}
          />
          <span onClick={() => props.changeLayerIndex(i)}>{l.label}</span>
          <input type="checkbox" checked={l.visible} onClick={() => toggle(i)}/>
          <span onClick={() => toggle(i)}>表示</span>
          <button onClick={() => up(i)} disabled={i == 0}>↑</button>
          <button onClick={() => down(i)} disabled={i == props.skin.layers.length - 1}>↓</button>
        </div>
    );
  });
  return (
    <div>
      <button onClick={() => add() }>新しいレイヤー</button>
      <div style={{ width: '200px' }}>{items}</div>
    </div>
  );
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
    return (
      <div>
        <PaletteView
          colors={this.state.colors}
          colorIndex={this.state.colorIndex}
          changeColorIndex={this.changeColorIndex}
        />
        <LayerEdit
          skin={this.state.skin}
          layerIndex={this.state.layerIndex}
          changeLayerIndex={this.changeLayerIndex}
          changeSkin={this.changeSkin}
        />
        <SaveForm skin={this.state.skin} />
        <Preview skin={this.state.skin} />
        <ImageEdit
          skin={this.state.skin}
          color={color}
          layerIndex={this.state.layerIndex}
          changeSkin={this.changeSkin.bind(this)}
        />
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('editor')
  const props = JSON.parse(node.dataset.props)

  ReactDOM.render(<Editor skin={props.skin} colors={props.colors}/>, node)
})
