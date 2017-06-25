// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

const style = {
  width: '200px',
  height: '200px',
  border: '1px solid black',
  background: 'lightgray',
  margin: '10px'
};

// class Layers {
//   // constructor
// }
// class Skin {
//   constructor(layers) {
//     this.layers = layers;
//   }
//   insertLayer(i, l) {
//     this.layers.add(l);
//   }
// }

class ImageView extends React.Component {
  render() {
    const refs = (element) => {
      if (element == null) { return; }

      const canvas = document.createElement('canvas')
      canvas.height = 200;
      canvas.width = 200;
      const ctx = canvas.getContext('2d');
      const sh = 200;
      const sw = 200;
      const im = ctx.createImageData(sw, sh);

      for(var i = 0; i < 4 * 200 * 200; ++i) {
        im.data[i] = this.props.imageData.get(i);
      }

      ctx.putImageData(im, 0, 0);
    
      var context = element.getContext('2d');
      context.clearRect(0, 0, 800, 800);
      context.drawImage(canvas, 0, 0, 800, 800);
    }
    return <canvas ref={refs} width={800} height={800} />;
  }
}


class ImageEdit extends React.Component {
  constructor(props) {
    super(props)

    var data = new Array(4 * 200 * 200);
    for(var y = 0; y < 200; ++y) {
      for(var x = 0; x < 200; ++x) {
        const i = 4 * (x + y * 200)
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255;        
      }
    }
    this.state = {
      imageData: Immutable.List(data)
    }
  }

  onMouseDown(event) {
    event.preventDefault()

  }

  render() {
    let onClick = (e) => {
      e.preventDefault();
      const x = Math.floor(e.nativeEvent.offsetX / 4)
      const y = Math.floor(e.nativeEvent.offsetY / 4)
      
      const i = 4 * (x + y * 200)

      const imageData = this.state.imageData.set(i, 255).set(i + 1, 255).set(i + 2, 255)
      
      this.setState({ imageData: imageData })
    }

    return (
      <div style={style} onClick={onClick}>
        <ImageView imageData={this.state.imageData} />
      </div>
    );
  }
}

const Editor = props => (
  <div>
    <ImageEdit />
  </div>
)

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('editor')
  const data = JSON.parse(node.getAttribute('data'))

  ReactDOM.render(<Editor {...data} />, node)
})
