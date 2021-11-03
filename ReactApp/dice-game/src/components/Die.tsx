import { useEffect, useState } from "react";

const Die: React.FC<any> = (props: any) => {
  const { die, isSelectable, dieIndex, keptDice, setKeptDice } = props;
  const [isHovered, setHoverState] = useState(false);
  const [dieIsSelected, setDieIsSelected] = useState(false);
  const isHoveredClass = (isSelectable && isHovered) ? 'hovered' : '';
  const isSelectableClass = isSelectable ? 'selectable' : '';
  const isSelectedClass = dieIsSelected ? 'selected': '';

  console.log(`Die ${dieIndex} render`);
  const handleDieClick = () => {
    console.log(`handleDieClick: ${dieIsSelected}`)
    // if(!dieIsSelected) {
    //   console.log("dies is not currently selected. Adding to keptDice and setting to selected");
    //   setDieIsSelected(true);
    //   // console.log('setKeptDice call');
    //   // setKeptDice([
    //   //   ...keptDice,
    //   //   {
    //   //     value: die,
    //   //     index: dieIndex
    //   //   }
    //   // ]);
      
    // } else {
    //   console.log('die is currently selected. Removing now.')
    //   // remove that mf
    //   setDieIsSelected(false);
    //   console.log('setKeptDice call');
    //   setKeptDice([keptDice.splice(dieIndex, 1)]);
    // }
    setDieIsSelected(!dieIsSelected);
  }

  useEffect(() => {
    console.log(`Poop: ${dieIndex}`);
  }, [dieIsSelected])

  // useEffect(() => {
  //   if(!dieIsSelected) {
  //     console.log("dies is not currently selected. Adding to keptDice and setting to selected");
  //     console.log('setKeptDice call');
  //     setKeptDice([
  //       ...keptDice,
  //       {
  //         value: die,
  //         index: dieIndex
  //       }
  //     ]);
      
  //   } else {
  //     console.log('die is currently selected. Removing now.')
  //     console.log('setKeptDice call');
  //     setKeptDice([keptDice.splice(dieIndex, 1)]);
  //   }
  // }, [dieIsSelected]);

  console.log(`Die ${dieIndex} is selected: ${dieIsSelected}`);
  return (
    <div
      className={`roll-value ${isSelectableClass} ${isSelectedClass} ${isHoveredClass}`}
      onMouseEnter={() => { setHoverState(true) }}
      onMouseLeave={() => { setHoverState(false) }}
      onClick={handleDieClick}
    >
      {die}
    </div>
  )
}

export default Die;