
import React, { useEffect } from "react";
import RangePicker from "react-range-picker";
import "../styles/styles.css";


interface Props {
  setDate: React.Dispatch<any>;
  date: any;
  customHeight:number;
}

function Range({ setDate, date,customHeight }: Props) {
  const onDateChanges = (date1, date2) => {
    if (date1 && date2) {
      setDate({ startDate: date1, endDate: date2 });
   
    

    }
  };

  function save() {
    console.log(date);
  }

  useEffect(()=>{
// console.log(date);

  },[date])
  

  useEffect(() => {
    // Accesează elementul .default-placeholder și setează înălțimea direct în JavaScript
    const defaultPlaceholderElement = document.querySelector('.default-placeholder') as HTMLElement | null;
    if (defaultPlaceholderElement) {
      defaultPlaceholderElement.style.height = `${customHeight}px`;
    }
  }, [customHeight]);
  return (
    <div>
      <RangePicker
        placeholderText="StartDate-EndDate"
        onDateSelected={onDateChanges}
      />
      {/* <button className='btn'>Select</button> */}
    </div>
  );
}

export default Range;
