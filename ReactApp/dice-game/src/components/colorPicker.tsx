import React, { useState } from "react";
import { setColor } from "../app/colorPicker";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { chatService } from "../services/services";
import { colorOptions } from "../types/chatTypes";
import { getColor } from '../app/colorPicker';

interface ColorSwatchProps {
  color: string;
}

const ColorPicker = () => {
  const dispatch = useAppDispatch();
  const selectedColor = useAppSelector(getColor);

  const setSelectedColor = (color: string) => {
    dispatch(setColor(color));
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
    
    const isHoveredClassName = isHovered ? 'hover' : '';
    const isSelectedClassName = color === selectedColor ? 'selected' : '';

    return (
      <div
        className={`color-swatch ${color} ${isHoveredClassName} ${isSelectedClassName}`}
        id={`swatch-${color}`}
        style={{ background: color }}
        onClick={() => { setSelectedColor(color) }}
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