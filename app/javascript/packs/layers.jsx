import React from 'react'
import Skin from './skin.jsx'

export default class Layers extends React.Component {
  render() {
    const props = this.props;
    const up = (i) => {
      if (i == 0) { return; }
      props.changeSkin(Skin.upLayer(props.skin, i), i - 1);
      props.changeLayerIndex(i - 1);
    };
    const down = (i) => {
      if (i == props.skin.length - 1) { return; }
      props.changeSkin(Skin.downLayer(props.skin, i));
      props.changeLayerIndex(i + 1);
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
      return (
        <div style={{borderBottom: "1px solid #ccc"}}>
          <span onClick={() => props.changeLayerIndex(i)}>{l.label}</span>
          <input type="checkbox" checked={l.visible} onClick={() => toggle(i)}/>
          <span onClick={() => toggle(i)}>表示</span>
          <button onClick={() => up(i)} disabled={i == 0}>↑</button>
          <button onClick={() => down(i)} disabled={i == props.skin.layers.length - 1}>↓</button>
        </div>
      );
    });
    return (
      <div>
        <button onClick={() => add() }>新しいレイヤー</button>
        <div style={{ width: '200px' }}>{items}</div>
      </div>
    );
  }
}