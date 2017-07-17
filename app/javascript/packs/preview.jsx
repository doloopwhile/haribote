import React from 'react'

export default class Preview extends React.Component {
  render() {
    const style = {
      height: '360px',
      width: '240px',
      background: 'yellow',
      lineHeight: '360px',
      textAlign: 'center',
      border: '1px solid black'
    };
    return <div id="preview" style={style}>プレビュー</div>;
  }
}
