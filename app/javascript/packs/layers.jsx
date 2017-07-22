import React from 'react'
import Skin from './skin.jsx'

const Layers = (props) => {
  const up = (i) => {
    if (i == 0) { return; }
    props.changeSkin(Skin.upLayer(props.skin, i), i - 1);
    if (i == props.layerIndex) {
      props.changeLayerIndex(i - 1);
    }
  };
  const down = (i) => {
    if (i == props.skin.length - 1) { return; }
    props.changeSkin(Skin.downLayer(props.skin, i));
    if (i == props.layerIndex) {
      props.changeLayerIndex(i + 1);
    }
  };
  const toggle = (i) => {
    props.changeSkin(Skin.toggleLayer(props.skin, i));
  };
  const add = () => {
    const label = prompt("新しいレイヤーの名前を入力してください", "");
    if (label == null) { return; }
    props.changeSkin(Skin.unshiftNewLayer(props.skin, label));
  };

  const items = props.skin.layers.map(function(l, i) {
    const buttonStyle = {
      padding: '0 16px',
    };

    const rowStyle = {
      borderBottom: "1px solid #ccc",
      display: 'grid'
    };
    if (!l.visible) {
      rowStyle.color = "#888";
    }
    if (i == props.layerIndex) {
      rowStyle.fontWeight = 'bold';
    }

    const labelStyle = {
      width: '16em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      gridColumn: 2
    };

    return (
      <div style={rowStyle}>
        <div style={{gridColumn: 1}}>
          <input type="checkbox" checked={l.visible} onClick={() => toggle(i)}/>
        </div>
        <div style={labelStyle} onClick={() => props.changeLayerIndex(i)}>
          {l.label}
        </div>
        <div style={{gridColumn: 3}}>
          <button style={buttonStyle} onClick={() => down(i)} disabled={i == props.skin.layers.length - 1}>↓</button>
          <button style={buttonStyle} onClick={() => up(i)} disabled={i == 0}>↑</button>
        </div>
      </div>
    );
  });

  return (
    <div>
      <header onClick={() => add() }>新しいレイヤー</header>
      <div>{items}</div>
    </div>
  );
};

export default Layers;