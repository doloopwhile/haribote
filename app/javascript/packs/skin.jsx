
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

export default Skin;
