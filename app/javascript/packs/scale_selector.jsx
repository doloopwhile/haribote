import React from 'react'

const ScaleSelector = ({scale, changeScale}) => {
  const buttons = [16, 24, 32].map((v) => {
    const style = {
      verticalAlign: "middle",
      fontSize: "32px",
      padding: "0 4px"
    };
    if (v === scale) {
      style.fontWeight = "bold";
    }
    return (
      <span style={style} onClick={(e) => changeScale(v)}>
        x{v}
      </span>
    );
  })

  return (
    <div style={{ display: "inline-block"}}>
      {buttons}
    </div>
  );
}

export default ScaleSelector;