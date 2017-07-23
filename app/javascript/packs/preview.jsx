import React from 'react'
import * as THREE from 'three'
import LayerSpecs from './layer_specs'
import Skin from './skin'

export default class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.ref = this.ref.bind(this);
  }

  ref(element) {
    const layerSpecKey = "head"
    const layerSpec = LayerSpecs[layerSpecKey];
    const layer = this.props.skin.layers[0];
    
    const createCanvas = (layerSpecKey, key) => {
      const p = layerSpec.planes[key];
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
      return canvas;
    };
    const createPlane = (layerSpecKey, planeKey) => {
      var t = new THREE.Texture(createCanvas(layerSpecKey, planeKey));
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.LinearMipMapLinearFilter;
      t.needsUpdate = true; 
      const material = new THREE.MeshBasicMaterial({map: t});
      material.side = THREE.DoubleSide;
      return new THREE.Mesh(geometry, material);
    }

    // レンダラーを作成
    const width = 300;
    const height = 400;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(1, 1);

    const parts = {
      head: {
        y: 1,
        planes: [

        ],
            head.add(planeTop());
    head.add(planeBottom());
    head.add(planeRight());
    head.add(planeFront());
    head.add(planeLeft());
    head.add(planeBack());
    head.position.y = 1
      }
    }
    const planeTop = () => {
      const p = createPlane("head", "top");
      p.position.y = 0.5;
      p.rotation.x = Math.PI / 2
      return p;
    }
    const planeBottom = () => {
      const p = createPlane("head", "bottom");
      p.position.y = -0.5;
      p.rotation.x = -Math.PI / 2
      return p;
    }
    const planeRight = () => {
      const p = createPlane("head", "right");
      p.position.x = -0.5;
      p.rotation.y = -Math.PI / 2
      return p;
    }
    const planeLeft = () => {
      const p = createPlane("head", "left");
      p.position.x = 0.5;
      p.rotation.y = Math.PI / 2
      return p;
    }
    const planeFront = () => {
      const p = createPlane("head", "front");
      p.position.z = 0.5;
      return p;
    }
    const planeBack = () => {
      const p = createPlane("head", "back");
      p.position.z = -0.5;
      return p;
    }


    var container = new THREE.Object3D();

    var head = new THREE.Object3D();
    head.add(planeTop());
    head.add(planeBottom());
    head.add(planeRight());
    head.add(planeFront());
    head.add(planeLeft());
    head.add(planeBack());
    head.position.y = 1
    container.add(head);

    scene.add(container);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    const alight = new THREE.AmbientLight(128);
    scene.add(alight);

    let vAngle = 0;
    let l = 5;
    let hAngle = 0;
    const update = () => {      
      const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      camera.position.set(
        0,
        l * Math.sin(vAngle),
        l * Math.cos(vAngle),
      );
      camera.lookAt(container.position)
      
      container.rotation.y = hAngle;
      renderer.render(scene, camera);
    };

    let px = 0;
    let py = 0;
    renderer.domElement.addEventListener("mousedown", (e) => {
      px = e.clientX;
      py = e.clientY;
    });

    renderer.domElement.addEventListener("mousemove", (e) => {
      vAngle += (e.clientY - py) * Math.PI / 180 / 2;
      
      if (vAngle > Math.PI / 2) { vAngle = Math.PI / 2; }
      if (vAngle < -Math.PI / 2) { vAngle = -Math.PI / 2; }
      
      hAngle += (e.clientX - px) * Math.PI / 180;

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
