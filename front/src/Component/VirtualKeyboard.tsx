import React, { useState } from "react";
import { Modal, Button } from "antd";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

interface VirtualKeyboardProps {
  onChange: (input: string) => void;
  visible: boolean;
  onClose: () => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onChange, visible, onClose }) => {
  const [, setInput] = useState("");
  const [layout, setLayout] = useState("default");

  const handleChange = (newInput: string) => {
    setInput(newInput);
    onChange(newInput);
  };

  const handleShift = () => {
    setLayout((prevLayout) => (prevLayout === "default" ? "shift" : "default"));
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      className="virtual-keyboard-modal"
      bodyStyle={{
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.1)",
        padding: "20px",
        borderRadius: "12px",
        backdropFilter: "blur(10px)",
      }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">Clavier Virtuel</h3>
      
      <Keyboard
        onChange={handleChange}
        layoutName={layout}
        onKeyPress={(button) => {
          if (button === "{shift}" || button === "{lock}") handleShift();
        }}
        theme="hg-theme-default hg-layout-default custom-keyboard"
      />

      <Button
        type="primary"
        onClick={onClose}
        className="mt-4 bg-blue-500 hover:bg-blue-600 border-none text-white px-4 py-2 rounded-lg"
      >
        Fermer
      </Button>
    </Modal>
  );
};

export default VirtualKeyboard;
