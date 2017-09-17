import LayerSpecs from "./layer_specs"

const uid = () => {
  return Math.random().toString();
}

const Skin = {
  width: 64,
  height: 64,
  
  putPixels(skin, i, pixels) {
    const data = Array.from(skin.layers[i].data);
    pixels.forEach((item) => {
      const [k, rgba] = item;
      data[4 * k]     = rgba[0];
      data[4 * k + 1] = rgba[1];
      data[4 * k + 2] = rgba[2];
      data[4 * k + 3] = rgba[3];
    });
    const layers = Array.from(skin.layers);
    layers[i] = Object.assign(layers[i], { data: data });
    return Object.assign({}, skin, { layers: layers, uid: uid() });
  },
  setLayerLabel(skin, i, label) {
    const layers = Array.from(skin.layers);
    layers[i] = Object.assign(layers[i], { label: label });
    return Object.assign({}, skin, { layers: layers, uid: uid() });
  },
  deleteLayer(skin, i) {
    const layers = Array.from(skin.layers);
    layers.splice(i, 1);
    return Object.assign({}, skin, { layers: layers, uid: uid() });
  },
  upLayer(skin, i) {
    if (i == 0) {
      return skin;
    }
    const layers = Array.from(skin.layers);
    const upper = layers[i - 1];
    layers[i - 1] = layers[i];
    layers[i] = upper;
    return Object.assign({}, skin, { layers: layers, uid: uid() });
  },
  downLayer(skin, i) {
    if (i == skin.layers.length - 1) {
      return skin;
    }
    const layers = Array.from(skin.layers);
    const lower = layers[i + 1];
    layers[i + 1] = layers[i];
    layers[i] = lower;
    return Object.assign({}, skin, { layers: layers, uid: uid() });
  },
  toggleLayer(skin, i) {
    const layers = Array.from(skin.layers);
    layers[i] = Object.assign(layers[i], { visible: !layers[i].visible });
    return Object.assign({}, skin, { layers: layers, uid: uid() });
  },
  unshiftNewLayer(skin, label, kind) {
    const layers = Array.from(skin.layers);
    const data = (new Array(skin.width * skin.height * 4)).map(function() { return 0; });
    layers.unshift({ label: label, visible: true, kind: kind, data: data });
    return Object.assign({}, skin, { layers: layers, uid: uid() });    
  },
  fill(skin, layerIndex, viewPos, rgba) {
    const layer = skin.layers[layerIndex];
    const layerSpec = LayerSpecs[layer.kind];
    const viewIndex = viewPos[0] + viewPos[1] * layerSpec.width;
    const imageIndex = layerSpec.viewToImageMapping[viewIndex];
    const imagePos = [
      imageIndex % Skin.width,
      imageIndex / Skin.width
    ];
    
    const plane = Object.values(layerSpec.planes).find((plane) => {
      return (
        plane.left <= imagePos[0] &&
        imagePos[0] < plane.left + plane.width &&
        plane.top <= imagePos[1] &&
        imagePos[1] < plane.top + plane.height
      );
    });

    if (plane === undefined) {
      return skin;
    }

    const data = Array.from(layer.data);
    const pixels = [];
    for (let y = 0; y < plane.height; ++y) {
      for (let x = 0; x < plane.width; ++x) {
        const i = (x + plane.left) + (y + plane.top) * Skin.width;
        pixels.push([i, rgba]);
      }
    }
    return Skin.putPixels(skin, layerIndex, pixels)
  }
}

export default Skin;
