import React, { useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

interface VirtualKeyboardProps {
  onChange: (input: string) => void;
  defaultValue?: string;
  layoutName?: string;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onChange, defaultValue = "", layoutName = "default" }) => {
  const [input, setInput] = useState(defaultValue);

  useEffect(() => {
    setInput(defaultValue);
  }, [defaultValue]);

  const handleChange = (newInput: string) => {
    if (newInput !== input) {
      setInput(newInput);
      onChange(newInput);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Keyboard
        onChange={handleChange}
        layoutName={layoutName}
        input={input}
      />
    </div>
  );
};

export default VirtualKeyboard;
