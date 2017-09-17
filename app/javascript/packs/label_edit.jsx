import React from 'react'
import Skin from './skin'

const LabelEdit = ({skin, layerIndex, changeSkin}) => {
  const l = skin.layers[layerIndex];
  const onChange = (e) => {
    changeSkin(Skin.setLayerLabel(skin, layerIndex, e.target.value));
  }
  return <input
    type={"text"}
    value={l.label}
    style={{width: "15em", display: "inline-block"}}
    onChange={onChange}
  />
}

export default LabelEdit;