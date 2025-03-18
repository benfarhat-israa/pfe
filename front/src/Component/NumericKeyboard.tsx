import React from 'react';
import { Button } from 'antd';

// Define the prop types
interface NumericKeyboardProps {
  onKeyPress: (key: number) => void;
  onBackspace: () => void;
  onClear: () => void;
}

// NumericKeyboard component
const NumericKeyboard: React.FC<NumericKeyboardProps> = ({ onKeyPress, onBackspace, onClear }) => {
  const keys = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [0],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px" }}>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              style={{
                width: "650px",
                height: "60px",
                fontSize: "20px",
                borderRadius: "8px",
                backgroundColor: "#1890ff",
                color: "#fff",
                border: "none",
                transition: "background-color 0.3s",
              }}
              // Add hover effect for better UX
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#40a9ff"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1890ff"}
            >
              {key}
            </Button>
          ))}
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "15px" }}>
        <Button
          onClick={onBackspace}
          style={{
            width: "100px",
            height: "60px",
            fontSize: "20px",
            borderRadius: "8px",
            backgroundColor: "#f5222d",
            color: "#fff",
            border: "none",
            transition: "background-color 0.3s",
          }}
          // Hover effect for better UX
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d43838"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f5222d"}
        >
          Backspace
        </Button>
        <Button
          onClick={onClear}
          style={{
            width: "100px",
            height: "60px",
            fontSize: "20px",
            borderRadius: "8px",
            backgroundColor: "#52c41a",
            color: "#fff",
            border: "none",
            transition: "background-color 0.3s",
          }}
          // Hover effect for better UX
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#389e0d"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#52c41a"}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default NumericKeyboard;
