import React, { useState } from "react";
import { setColor } from "../app/colorPicker";
import { useAppDispatch } from "../app/hooks";
import { chatService } from "../services/services";
import { colorOptions } from "../types/chatTypes";

interface ColorSwatchProps {
  color: string;
}

const ColorPicker = () => {
  const dispatch = useAppDispatch();

  const selectColor = (color: string) => {
    dispatch(setColor(color));
    chatService.setColor(color);
  }

  const ColorOptions: React.FC = (): JSX.Element => {
    return (
      <div className='color-options flex centered'>
        {colorOptions.map((color, index) => {
          return <ColorSwatch color={color} key={index}/>
        })}
      </div>
    );
  }

  const ColorSwatch: React.FC<ColorSwatchProps> = (props: ColorSwatchProps): JSX.Element => {
    const { color } = props;
    const [isHovered, setHoverState] = useState(false);

    return (
      <div
        className={`color-swatch ${color} ${isHovered && 'hover'}`}
        id={`swatch-${color}`}
        style={{ background: color }}
        onClick={() => { selectColor(color) }}
        onMouseEnter={() => setHoverState(true)}
        onMouseLeave={() => setHoverState(false)}
      ></div >
    )
  }

  return (
    <div className='color-picker flex-centered'>
      <ColorOptions />
    </div>
  )
}

export default ColorPicker;