import React from 'react'
import * as THREE from 'three'
import LayerSpecs from './layer_specs'
import Skin from './skin'


const pi = Math.PI;
const rotations = {
  top:    [-pi/2, 0, 0],
  bottom: [-pi/2, 0, 0],
  right:  [0, -pi/2, 0],
  front:  [0, 0, 0],
  left:   [0,  pi/2, 0],
  back:   [0,  pi, 0]
};

const sides = {
  top:    THREE.FrontSide,
  bottom: THREE.BackSide,
  right:  THREE.FrontSide,
  front:  THREE.FrontSide,
  left:   THREE.FrontSide,
  back:   THREE.FrontSide
};

const boxes = [
  {
    position: [0, 10, 0],
    parts: [
      { keys: ["head", "top"],    position: [ 0,  4,  0] },
      { keys: ["head", "bottom"], position: [ 0, -4,  0] },
      { keys: ["head", "right"],  position: [-4,  0,  0] },
      { keys: ["head", "front"],  position: [ 0,  0,  4] },
      { keys: ["head", "left"],   position: [ 4,  0,  0]  },
      { keys: ["head", "back"],   position: [ 0,  0, -4] }
    ]
  },
  {
    position: [0, 0, 0],
    parts: [
      { keys: ["body", "top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["body", "bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["body", "right"],  position: [-4, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["body", "front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["body", "left"],   position: [4,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["body", "back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [6, 0, 0],
    parts: [
      { keys: ["arms", "larm_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["arms", "larm_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["arms", "larm_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["arms", "larm_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["arms", "larm_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["arms", "larm_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [-6, 0, 0],
    parts: [
      { keys: ["arms", "rarm_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["arms", "rarm_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["arms", "rarm_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["arms", "rarm_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["arms", "rarm_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["arms", "rarm_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [2, -12, 0],
    parts: [
      { keys: ["legs", "lleg_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["legs", "lleg_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["legs", "lleg_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["legs", "lleg_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["legs", "lleg_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["legs", "lleg_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [-2, -12, 0],
    parts: [
      { keys: ["legs", "rleg_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["legs", "rleg_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["legs", "rleg_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["legs", "rleg_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["legs", "rleg_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["legs", "lleg_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [0, 10, 0],
    parts: [
      { keys: ["head_wear", "top"],    position: [ 0,  4,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["head_wear", "bottom"], position: [ 0, -4,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["head_wear", "right"],  position: [-4,  0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["head_wear", "front"],  position: [ 0,  0,  4], rotation: [0, 0, 0] },
      { keys: ["head_wear", "left"],   position: [ 4,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["head_wear", "back"],   position: [ 0,  0, -4], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [0, 0, 0],
    parts: [
      { keys: ["body_wear", "top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["body_wear", "bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["body_wear", "right"],  position: [-4, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["body_wear", "front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["body_wear", "left"],   position: [4,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["body_wear", "back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [6, 0, 0],
    parts: [
      { keys: ["arms_wear", "larm_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["arms_wear", "larm_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["arms_wear", "larm_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["arms_wear", "larm_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["arms_wear", "larm_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["arms_wear", "larm_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [-6, 0, 0],
    parts: [
      { keys: ["arms_wear", "rarm_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["arms_wear", "rarm_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["arms_wear", "rarm_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["arms_wear", "rarm_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["arms_wear", "rarm_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["arms_wear", "rarm_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [2, -12, 0],
    parts: [
      { keys: ["legs_wear", "lleg_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["legs_wear", "lleg_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["legs_wear", "lleg_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["legs_wear", "lleg_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["legs_wear", "lleg_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["legs_wear", "lleg_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
  {
    position: [-2, -12, 0],
    parts: [
      { keys: ["legs_wear", "rleg_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
      { keys: ["legs_wear", "rleg_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
      { keys: ["legs_wear", "rleg_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
      { keys: ["legs_wear", "rleg_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
      { keys: ["legs_wear", "rleg_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
      { keys: ["legs_wear", "lleg_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
    ]
  },
];

export default class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.width = 300;
    this.height = 400;
    this.state = { vAngle: 0, hAngle: 0, container: this.createContainer(props.skin) };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  componentWillReceiveProps(props) {
    if (props.skin.uid !== this.props.skin.uid) {
      this.setState({ container: this.createContainer(props.skin) }, () => {
        setTimeout(() => { this.state.repaint() });
      });
    }
  }

  createContainer(skin) {
    const layerCanvass = [];
    for (let i = 0; i < skin.layers.length; ++i) {
      const layer = skin.layers[i];

      const canvas = document.createElement('canvas');
      canvas.width = Skin.width;
      canvas.height= Skin.height;
      const ctx = canvas.getContext("2d");
      const im = ctx.createImageData(Skin.width, Skin.height);
      im.data.set(layer.data, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.putImageData(im, 0, 0);
      layerCanvass.push(canvas);
    }

    const createCanvas = (layerSpecKey, key) => {   
      const p = LayerSpecs[layerSpecKey].planes[key];
      
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = 256;
      scaledCanvas.height = 256;
    
      const scaledCtx = scaledCanvas.getContext('2d');
      scaledCtx.imageSmoothingEnabled = false;
      
      for (let i = skin.layers.length - 1; i >= 0; --i) {
        const l = skin.layers[i];
        if (l.kind == layerSpecKey && l.visible) {
          scaledCtx.drawImage(layerCanvass[i],
            p.left, p.top, p.width, p.height,
            0, 0, scaledCanvas.width, scaledCanvas.height
          );
        }
      }
      return scaledCanvas;    
    };

    const planeCanvass = {};
    boxes.forEach((b) => {
      var box = new THREE.Object3D();
      box.position.set(b.position[0], b.position[1], b.position[2]);

      b.parts.forEach((part) => {
        const planeSpec = LayerSpecs[part.keys[0]].planes[part.keys[1]];

        planeCanvass[part.keys[0] + "-" + part.keys[1]] = 
          createCanvas(part.keys[0], part.keys[1]);
      });
    });

    const wear_spacing = 0.3;

    var container = new THREE.Object3D();
    boxes.forEach((b) => {
      var box = new THREE.Object3D();
      box.position.set(b.position[0], b.position[1], b.position[2]);

      b.parts.forEach((part) => {
        const planeSpec = LayerSpecs[part.keys[0]].planes[part.keys[1]];

        var texture = new THREE.Texture(planeCanvass[part.keys[0] + "-" + part.keys[1]]);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.needsUpdate = true; 

        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true,
          overdraw: true
        });
        material.side = sides[part.keys[1].replace(/.*_/, '')];
        
        const sign = (x) => {
          if (x < 0) { return -1; }
          if (x > 0) { return 1; }
          return 0
        }
        let width = planeSpec.width;
        let height = planeSpec.height;
        const position = [].concat(part.position);
        const rotation = rotations[part.keys[1].replace(/.*_/, '')];

        if (part.keys[0] === "upper_body_wear" ||
            part.keys[0] === "lower_body_wear" ||
            part.keys[0] === "head_wear"
        ) {
          position[0] += sign(position[0]) * wear_spacing;
          position[1] += sign(position[1]) * wear_spacing;
          position[2] += sign(position[2]) * wear_spacing;
          width  += 2 * wear_spacing;
          height += 2 * wear_spacing;
        }

        const geometry = new THREE.PlaneGeometry(width, height);
        const plane = new THREE.Mesh(geometry, material);

        plane.position.set(position[0], position[1], position[2]);
        plane.rotation.set(rotation[0], rotation[1], rotation[2]);
        if (part.keys[0] === 'head' && part.keys[1] === 'top') {
          window.top_plane = plane;
        }
        box.add(plane);
      });
      container.add(box);
    });

    return container;
  }

  ref(element) {
    if (element == null) { return; }
    while(element.firstChild){
      element.removeChild(element.firstChild);
    }

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.width, this.height);

    let l = 50;
    const repaint = () => {
      const container = this.state.container;

      const scene = new THREE.Scene();
      scene.add(container);

      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(100, 100, 100);
      scene.add(light);

      const alight = new THREE.AmbientLight(128);
      scene.add(alight);
    
      const camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
      camera.position.set(
        0,
        l * Math.sin(this.state.vAngle),
        l * Math.cos(this.state.vAngle),
      );
      camera.lookAt(container.position)
      
      container.rotation.y = this.state.hAngle;
      renderer.render(scene, camera);
    };

    let px = null;
    let py = null;

    const handleMoveStart = (x, y) => {
      px = x;
      py = y;
    };

    const handleMove = (x, y) => {
      let vAngle = this.state.vAngle + (y - py) * Math.PI / 180 * 0.8;
      let hAngle = this.state.hAngle + (x - px) * Math.PI / 180 * 1.5;
      
      if (vAngle > Math.PI / 2) { vAngle = Math.PI / 2; }
      if (vAngle < -Math.PI / 2) { vAngle = -Math.PI / 2; }
      this.setState({ hAngle: hAngle, vAngle: vAngle });
      px = x;
      py = y;
      repaint();
    }

    renderer.domElement.addEventListener("mousemove", (e) => {
      if (e.which !== 1) { return }
      handleMove(e.clientX, e.clientY);
    });

    renderer.domElement.addEventListener("mousedown", (e) => {
      if (e.which !== 1) { return }
      handleMoveStart(e.clientX, e.clientY);
    });

    renderer.domElement.addEventListener("touchstart", (e) => {
      handleMoveStart(e.touches[0].clientX, e.touches[0].clientY);
    });

    renderer.domElement.addEventListener("touchmove", (e) => {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    });

    repaint();

    let repaintRequested = false;
    const requestRepaint = () => {
      repaintRequested = true;
    };

    setInterval(() => {
      if (repaintRequested) {
        repaintRequested = false;
        repaint();
      }
    }, 500);

    this.setState({ repaint: repaint, requestRepaint: requestRepaint });
    element.appendChild(renderer.domElement);
  }
  render() {
    const style = {
      display: 'inline-block',
      width: this.width,
      height: this.height
    };
    return <div id="preview"
      ref={this.ref.bind(this)}
      style={style}
    ></div>;
  }
}
