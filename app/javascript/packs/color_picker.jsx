import React from 'react'
import ReactModal from "react-modal"
import { ChromePicker, CustomPicker } from 'react-color';
import { Saturation, Hue } from 'react-color/lib/components/common';
import { ChromePointerCircle } from 'react-color/lib/components/chrome/ChromePointerCircle';
import { ChromePointer } from 'react-color/lib/components/chrome/ChromePointer';

const colorPickerImpl = ({ onChange, rgb, hsl, hsv, hex, renderers }) => {
  const style = {
    width: "400px",
    position: "relative",
    padding: '2px',
    border: '1px solid lightgray',
    display: "inline-block"
  };
  return (
    <div style={style}>
      <div style={{height: '300px', position: 'relative', marginBottom: '2px'}}>
        <Saturation
          hsl={ hsl }
          hsv={ hsv }
          pointer={ ChromePointerCircle }
          onChange={ onChange }
        />
      </div>
      <div style={{height: '30px', position: 'relative'}}>
        <Hue
          pointer={ ChromePointer }
          hsl={ hsl }
          onChange={ onChange }
        />
      </div>
    </div>
  );
}

const ColorPickerComponent = CustomPicker(colorPickerImpl);

class ColorPicker extends React.Component {
  rgbToString(rgb) {
    const hex = (v) => ("0" + v.toString(16)).substr(-2);
    return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
  }
  stringToRgb(value) {
    return [
      parseInt(value.substring(1, 3), 16),
      parseInt(value.substring(3, 5), 16),
      parseInt(value.substring(5, 7), 16)
    ];
  }
  onChange(color) {
    const rgb = [color.rgb.r, color.rgb.g, color.rgb.b];
    this.props.changeColor(this.props.colorIndex, rgb);
  }
  render() {
    const rgb = this.props.colors[this.props.colorIndex];
    const previewStyle = {
      backgroundColor: this.rgbToString(rgb),
      border: "2px solid #CCC",
      height: "128px",
      width: "128px",
      display: "inline-block"
    };

    return <div>
      <ColorPickerComponent
        color={this.rgbToString(rgb)}
        onChange={this.onChange.bind(this)}
      />
      <div style={previewStyle}></div>
    </div>;
  }
}

export default ColorPicker;