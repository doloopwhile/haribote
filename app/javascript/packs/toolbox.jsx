import React from 'react'

const Toolbox = ({tool, changeTool}) => {
  const toolButtons = [
    ["pen", "assets/open-iconic/svg/pencil.svg"],
    ["eraser", "assets/open-iconic/svg/delete.svg"],
    ["bucket", "assets/open-iconic/svg/droplet.svg"],
    ["picker", "assets/open-iconic/svg/eyedropper.svg"]
  ].map((v) => {
    const style = {
      opacity: (tool == v[0]) ? 1 : 0.5,
      verticalAlign: "middle"
    };
    return (
      <img
        width={32}
        height={32}
        src={v[1]}
        onClick={() => changeTool(v[0])}
        style={style}
      />
    );
  });
  return <div style={{
    display: "inline-block"
  }}>{toolButtons}</div>
}

export default Toolbox;