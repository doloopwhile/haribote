import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Immutable from 'immutable'



const copyArrayElements = (arrDst, arrSrc) => {
  for(var k = 0; k < arrSrc.length; ++k) {
    arrDst[k] = arrSrc[k];
  }
}

const ImageView = props => {
  const h = props.height;
  const w = props.width;

  const refs = (element) => {
    if (element == null) { return; }

    const skin = props.skin;

    for(var i = 0; i < skin.layers.length; ++i) {
      const canvas = document.createElement('canvas')
      canvas.height = skin.height;
      canvas.width  = skin.width;

      const ctx = canvas.getContext('2d');
      const im = ctx.createImageData(skin.width, skin.height);
      copyArrayElements(im.data, skin.layers[i].data)
      ctx.putImageData(im, 0, 0);
    
      var context = element.getContext('2d');
      context.clearRect(0, 0, w, h);
      context.imageSmoothingEnabled = false;
      context.drawImage(canvas, 0, 0, w, h);
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
      <ImageView width={64} height={64} skin={props.skin}/>
    </div>
  )
}

let putPixels = (skin, i, pixels) => {
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
  const layers = Array.from(skin.layers)
  layers[i] = { data: data }      
  return { width: skin.width, height: skin.height, layers: layers }
}


class ImageEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      prevPos: null,
      scale: 20
    }
  }

  render() {
    let onMouseDown = (e) => {
      e.preventDefault();
      if (e.nativeEvent.which !== 1) { return }
      const x = Math.floor(e.nativeEvent.offsetX / this.state.scale)
      const y = Math.floor(e.nativeEvent.offsetY / this.state.scale)

      const skin = putPixels(this.props.skin, 0, [[x, y, [255, 0, 255, 255]]])
      this.setState({prevPos: [x, y]})
      this.props.onSkinChange(skin)   
    }

    let onMouseMove = (e) => {
      e.preventDefault();
      if (this.state.prevPos == null) { return }
      if (e.nativeEvent.which !== 1) { return }

      const x = Math.floor(e.nativeEvent.offsetX / this.state.scale)
      const y = Math.floor(e.nativeEvent.offsetY / this.state.scale)

      const px = this.state.prevPos[0]
      const py = this.state.prevPos[1]

      const pixels = []
      pixels.push([x, y, [255, 0, 255, 255]])
      const m = Math.abs(x - px) + Math.abs(y - py)
      for (var i = 1; i < m; i++) {
        const x1 = Math.floor(((m - i) * x + i * px) / m)
        const y1 = Math.floor(((m - i) * y + i * py) / m)
        pixels.push([x1, y1, [255, 0, 255, 255]])        
      }
      pixels.push([px, py, [255, 0, 255, 255]])

      const skin = putPixels(this.props.skin, 0, pixels)
      this.setState({ prevPos: [x, y] })
      this.props.onSkinChange(skin)   
    }

    let onMouseUp = (e) => {
      if (e.nativeEvent.which !== 1) { return }
      this.setState({prevPos: null})
    }
    let onMouseLeave = (e) => {
      if (e.nativeEvent.which !== 1) { return }
      this.setState({prevPos: null})
    }

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
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <ImageView skin={this.props.skin} width={(64 * this.state.scale)} height={(64 * this.state.scale)}/>
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

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      skin: props.skin
    }
  }
  onSkinChange(skin) {
    this.setState({skin: skin})
  }
  render() {
    return (
      <div>
        <SaveForm skin={this.state.skin} />
        <Preview skin={this.state.skin} />
        <ImageEdit skin={this.state.skin}
          onSkinChange={this.onSkinChange.bind(this)}
        />
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('editor')
  const skin = JSON.parse(node.getAttribute('skin'))

  ReactDOM.render(<Editor skin={skin} />, node)
})
