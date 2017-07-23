import React from 'react'
import * as THREE from 'three'
import LayerSpecs from './layer_specs'
import Skin from './skin'

export default class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.ref = this.ref.bind(this);
    this.state = { vAngle: 0, hAngle: 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.skin !== nextProps.skin;
  }

  ref(element) {
    const createCanvas = (layerSpecKey, key) => {
      const layer = this.props.skin.layers[0];
    
      const p = LayerSpecs[layerSpecKey].planes[key];
      const canvas = document.createElement('canvas');
      canvas.height = p.height;
      canvas.width = p.width;
      const ctx = canvas.getContext("2d");

      const im = ctx.createImageData(p.width, p.height);
      for(var y = 0; y < p.height; ++y) {
        for(var x = 0; x < p.width; ++x) {
          const viewIndex = x + y * p.width;
          const imageIndex = (x + p.left) + (y + p.top) * Skin.width;
          im.data[4 * viewIndex + 0] = layer.data[4 * imageIndex + 0];
          im.data[4 * viewIndex + 1] = layer.data[4 * imageIndex + 1];
          im.data[4 * viewIndex + 2] = layer.data[4 * imageIndex + 2];
          im.data[4 * viewIndex + 3] = layer.data[4 * imageIndex + 3];
        }
      }
      ctx.imageSmoothingEnabled = false;
      ctx.putImageData(im, 0, 0);
      element.appendChild(canvas);
      // return canvas;
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = 256;
      scaledCanvas.height = 256;
      
      const scaledCtx = scaledCanvas.getContext('2d');
      scaledCtx.imageSmoothingEnabled = false;
      scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      return scaledCanvas;
    };

    // レンダラーを作成
    const width = 300;
    const height = 400;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

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
          { keys: ["upper_body", "body_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["upper_body", "body_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["upper_body", "body_right"],  position: [-4, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["upper_body", "body_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["upper_body", "body_left"],   position: [4,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["upper_body", "body_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
      {
        position: [6, 0, 0],
        parts: [
          { keys: ["upper_body", "larm_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["upper_body", "larm_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["upper_body", "larm_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["upper_body", "larm_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["upper_body", "larm_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["upper_body", "larm_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
      {
        position: [-6, 0, 0],
        parts: [
          { keys: ["upper_body", "rarm_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["upper_body", "rarm_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["upper_body", "rarm_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["upper_body", "rarm_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["upper_body", "rarm_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["upper_body", "rarm_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
      {
        position: [2, -12, 0],
        parts: [
          { keys: ["lower_body", "lleg_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["lower_body", "lleg_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["lower_body", "lleg_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["lower_body", "lleg_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["lower_body", "lleg_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["lower_body", "lleg_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
      {
        position: [-2, -12, 0],
        parts: [
          { keys: ["lower_body", "rleg_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["lower_body", "rleg_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["lower_body", "rleg_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["lower_body", "rleg_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["lower_body", "rleg_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["lower_body", "lleg_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
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
          { keys: ["upper_body_wear", "body_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["upper_body_wear", "body_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["upper_body_wear", "body_right"],  position: [-4, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["upper_body_wear", "body_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["upper_body_wear", "body_left"],   position: [4,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["upper_body_wear", "body_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
      {
        position: [6, 0, 0],
        parts: [
          { keys: ["upper_body_wear", "larm_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["upper_body_wear", "larm_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["upper_body_wear", "larm_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["upper_body_wear", "larm_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["upper_body_wear", "larm_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["upper_body_wear", "larm_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
      {
        position: [-6, 0, 0],
        parts: [
          { keys: ["upper_body_wear", "rarm_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["upper_body_wear", "rarm_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["upper_body_wear", "rarm_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["upper_body_wear", "rarm_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["upper_body_wear", "rarm_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["upper_body_wear", "rarm_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
      {
        position: [2, -12, 0],
        parts: [
          { keys: ["lower_body_wear", "lleg_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["lower_body_wear", "lleg_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["lower_body_wear", "lleg_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["lower_body_wear", "lleg_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["lower_body_wear", "lleg_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["lower_body_wear", "lleg_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
      {
        position: [-2, -12, 0],
        parts: [
          { keys: ["lower_body_wear", "rleg_top"],    position: [0,  6,  0], rotation: [ pi/2, 0, 0] },
          { keys: ["lower_body_wear", "rleg_bottom"], position: [0, -6,  0], rotation: [-pi/2, 0, 0] },
          { keys: ["lower_body_wear", "rleg_right"],  position: [-2, 0,  0], rotation: [0, -pi/2, 0] },
          { keys: ["lower_body_wear", "rleg_front"],  position: [0,  0,  2], rotation: [0, 0, 0] },
          { keys: ["lower_body_wear", "rleg_left"],   position: [2,  0,  0], rotation: [0,  pi/2, 0] },
          { keys: ["lower_body_wear", "lleg_back"],   position: [0,  0, -2], rotation: [0, 0, 0] }
        ]
      },
    ];
    
    const wear_spacing = 0.3;

    var container = new THREE.Object3D();
    boxes.forEach((b) => {
      var box = new THREE.Object3D();
      box.position.set(b.position[0], b.position[1], b.position[2]);

      b.parts.forEach((part) => {
        const planeSpec = LayerSpecs[part.keys[0]].planes[part.keys[1]];

        var texture = new THREE.Texture(createCanvas(part.keys[0], part.keys[1]));
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
        const position = part.position;
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
    scene.add(container);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(100, 100, 100);
    scene.add(light);

    const alight = new THREE.AmbientLight(128);
    scene.add(alight);

    let l = 50;
    const update = () => {      
      const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      camera.position.set(
        0,
        l * Math.sin(this.state.vAngle),
        l * Math.cos(this.state.vAngle),
      );
      camera.lookAt(container.position)
      
      container.rotation.y = this.state.hAngle;
      renderer.render(scene, camera);
    };

    let px = 0;
    let py = 0;
    renderer.domElement.addEventListener("mousedown", (e) => {
      px = e.clientX;
      py = e.clientY;
    });

    renderer.domElement.addEventListener("mousemove", (e) => {
      let vAngle = this.state.vAngle + (e.clientY - py) * Math.PI / 180 / 2;
      
      if (vAngle > Math.PI / 2) { vAngle = Math.PI / 2; }
      if (vAngle < -Math.PI / 2) { vAngle = -Math.PI / 2; }
      
      let hAngle = this.state.hAngle + (e.clientX - px) * Math.PI / 180;
      this.setState({ hAngle: hAngle, vAngle: vAngle });

      px = e.clientX;
      py = e.clientY;

      update();
    });

    update();
  }
  render() {
    const style = {
      background: 'yellow',
    };
    return <div id="preview"
      ref={this.ref}
      style={style}
    ></div>;
  }
}
