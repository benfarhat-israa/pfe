import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const VirtualKeyboard = ({ onChange }: { onChange: (input: string) => void }) => {
  const [input, setInput] = useState(""); // État pour le texte saisi

  const handleChange = (input: string) => {
    setInput(input); // Mettre à jour le texte local
    onChange(input);  // Passer le texte au parent via la fonction onChange
  };

  return (
    <div>
      <Keyboard
        onChange={handleChange}  // Fonction de callback pour gérer la saisie
        layoutName="default"      // Utilisation de la disposition par défaut
        input={input}             // Lier l'état à l'input du clavier virtuel
      />
    </div>
  );
};

export default VirtualKeyboard;
