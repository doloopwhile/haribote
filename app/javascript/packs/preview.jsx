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
    const layerSpec = LayerSpecs.head;
    const layer = this.props.skin.layers[0];
    
    const canvases = [];
    Object.keys(layerSpec.planes).forEach((key) => {
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
      ctx.putImageData(im, 0, 0);
      element.appendChild(canvas);
      canvases.push(canvas);
    });

    // レンダラーを作成
    const width = 300;
    const height = 400;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(1, 1);

    const planeTop = () => {
      const material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
      const plane = new THREE.Mesh( geometry, material );
      plane.position.y = 0.5;
      plane.rotation.x = Math.PI / 2
      return plane;
    }
    const planeBottom = () => {
      const material = new THREE.MeshBasicMaterial({color: 0xff8080, side: THREE.DoubleSide});
      const plane = new THREE.Mesh( geometry, material );
      plane.position.y = -0.5;
      plane.rotation.x = -Math.PI / 2
      return plane;
    }

    const planeRight = () => {
      const material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
      const plane = new THREE.Mesh( geometry, material );
      plane.position.x = -0.5;
      plane.rotation.y = Math.PI / 2
      return plane;
    }

    const planeLeft = () => {
      const material = new THREE.MeshBasicMaterial({color: 0x80ff80, side: THREE.DoubleSide});
      const plane = new THREE.Mesh(geometry, material);
      plane.position.x = 0.5;
      plane.rotation.y = -Math.PI / 2
      return plane;
    }

    const planeFront = () => {
      const material = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
      const plane = new THREE.Mesh( geometry, material );
      plane.position.z = 0.5;
      return plane;
    }

    const planeBack = () => {
      const material = new THREE.MeshBasicMaterial({color: 0x8080ff, side: THREE.DoubleSide});
      const plane = new THREE.Mesh( geometry, material );
      plane.position.z = -0.5;
      return plane;
    }


    var container = new THREE.Object3D();
    container.add(planeTop());
    container.add(planeBottom());
    container.add(planeRight());
    container.add(planeFront());
    container.add(planeLeft());
    container.add(planeBack());
    
    scene.add(container);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    const alight = new THREE.AmbientLight(128);
    scene.add(alight);


    let vAngle = 0;
    let l = 5;
    const update = () => {
      requestAnimationFrame(update);

      vAngle += 0.01;
      const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      camera.position.set(
        0,
        l * Math.sin(vAngle),
        l * Math.cos(vAngle),
      );
      camera.lookAt(container.position)
      
      // container.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
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
