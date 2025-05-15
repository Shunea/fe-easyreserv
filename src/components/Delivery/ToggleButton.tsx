import { useEffect, useState } from "react";
import "./ToggleButton.css";    

interface ToggleButtonProps {
  onToggle: () => void;
}

export default function ToggleButton({ onToggle }: ToggleButtonProps) {
  const [isToggled, setIsToggled] = useState(() => {
    // Retrieve the toggle state from localStorage
    const savedState = localStorage.getItem("toggleState");
    return savedState === "true"; // Convert string to boolean
  });
  
  const handleChange = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    onToggle();
    localStorage.setItem("toggleState", JSON.stringify(newState)); // Save the new state
  };

  useEffect(() => {
    // Update localStorage whenever isToggled changes
    localStorage.setItem("toggleState", JSON.stringify(isToggled));
  }, [isToggled]);

  return (
    <button onClick={handleChange} className={`toggle-button ${isToggled ? 'on' : 'off'}`}>
      {isToggled ? 'Delivery is active' : 'Delivery is inactive'}
    </button>
  );
}