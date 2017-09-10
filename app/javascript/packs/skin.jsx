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
  fill(skin, i, viewPos, rgb) {
    const layer = skin.layers[layerIndex];
    const data = Array.from(skin.layers[i].data);
    const layerSpec = LayerSpec[layer.kind];

    const w = layerSpec.width;
    const viewIndex = viewPos[0] + viewPos[1] * w;
    const imageIndex = layerSpec.viewToImageMapping[viewIndex];
    const imagePos = [imageIndex % w, imageIndex / w];

    const plane = Object.entries(layerSpec.planes).findIndex((e) => {
      const plane = e.value[1];
      return (
        plane.left <= imagePos[0] &&
        plane.left + plane.width + imagePos[0] &&
        plane.top <= imagePos[1] &&
        plane.top + plane.height + imagePos[1]
      );
    });

    planePixels = [];
    for (let y = plane.top; y < plane.top + plane.height; ++y) {
      for (let x = plane.left; x < plane.left + plane.width; ++x) {
        const index = x + y * w;
        const rgb = data.slice(index * 4, index * 4 + 3);
        planePixels.push({ index: index, x: x, y: y, rgb: rgb });
      }
    }

    const pixelsToFlood = getPixelsToFlood(imagePos, rgb, planePixels);
    
    return Skin.putPixels(skin, i, pixels)
  }
}

export default Skin;
