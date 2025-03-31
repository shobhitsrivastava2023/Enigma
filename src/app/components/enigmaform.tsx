"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EnigmaMachine } from "../../../Resources/enigma"; // Adjust path as needed

export default function EnigmaForm() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [encryptedKey, setEncryptedKey] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  // Enigma settings
  const [rotorPositions, setRotorPositions] = useState([2, 3, 1]);
  const [reflectorName, setReflectorName] = useState("B"); // Fixed Reflector
  const [selectedRotors, setSelectedRotors] = useState(["I", "II", "III"]);  // More standard initialization
  const [ringSettings, setRingSettings] = useState([0, 0, 0]);  // Changed to 3 items
  const [plugboardConnections, setPlugboardConnections] = useState("");

  // Enigma Machine instance
  const [enigmaMachine, setEnigmaMachine] = useState<EnigmaMachine | null>(null);

  // Initialize Enigma Machine
  useEffect(() => {
    const config = {
      rotors: selectedRotors,
      reflectorName: reflectorName,
      rotorPositions: rotorPositions,
      ringSettings: ringSettings,
      plugboardConnections: plugboardConnections,
    };
    setEnigmaMachine(new EnigmaMachine(config));
  }, [selectedRotors, reflectorName, rotorPositions, ringSettings, plugboardConnections]);


  // Encryption Function
  const encryptLetter = useCallback(
    (letter: string) => {
      if (!enigmaMachine) return letter; // Return original if no enigma instance

      const encryptedChar = enigmaMachine.encryptChar(letter);

      // Update rotor positions locally
      setRotorPositions([
        enigmaMachine.leftRotor.rotorPosition,
        enigmaMachine.middleRotor.rotorPosition,
        enigmaMachine.rightRotor.rotorPosition,
      ]);

      return encryptedChar;
    },
    [enigmaMachine]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        setActiveKey(key);
        const encrypted = encryptLetter(key);
        setEncryptedKey(encrypted);
        setInputText((prev) => prev + key);
        setOutputText((prev) => prev + encrypted);
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
      setTimeout(() => setEncryptedKey(null), 200);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [encryptLetter]);


  // Handle clicking on keyboard keys
  const handleKeyClick = (key: string) => {
    setActiveKey(key);
    const encrypted = encryptLetter(key);
    setEncryptedKey(encrypted);
    setInputText((prev) => prev + key);
    setOutputText((prev) => prev + encrypted);
    setTimeout(() => {
      setActiveKey(null);
      setTimeout(() => setEncryptedKey(null), 200);
    }, 300);
  };

  const renderKeyboard = (isOutput = false) => {
    const rows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M"],
    ];

    return (
      <div className="flex flex-col items-center gap-2">
        {isOutput ? (
          <div className="w-full bg-neutral-800 rounded-md p-4 mb-4 text-center text-white text-2xl font-mono h-14 flex items-center justify-center">
            {encryptedKey || "U"}
          </div>
        ) : (
          <div className="w-full bg-neutral-800 rounded-md p-4 mb-4 text-center text-white text-2xl font-mono h-14 flex items-center justify-center">
            {activeKey || "D"}
          </div>
        )}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => {
              const isActive = isOutput ? key === encryptedKey : key === activeKey;
              return (
                <button
                  key={key}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm transition-colors ${isActive ? "bg-yellow-500 text-black" : "text-white"
                    }`}
                  onClick={() => !isOutput && handleKeyClick(key)}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  const updateRotorValue = (index: number, newValue: number) => {
    setRotorPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      newPositions[index] = newValue;
      return newPositions;
    });
  };

  const updateRotorSelection = (index: number, newRotor: string) => {
    setSelectedRotors((prevRotors) => {
      const newRotors = [...prevRotors];
      newRotors[index] = newRotor;
      return newRotors;
    });
  };

  const updateRingSetting = (index: number, newSetting: number) => {
    setRingSettings((prevSettings) => {
      const newSettings = [...prevSettings];
      newSettings[index] = newSetting;
      return newSettings;
    });
  };



  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Encrypt Mode</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center">{renderKeyboard(false)}</div>
        <div className="flex flex-col items-center">{renderKeyboard(true)}</div>
      </div>

      <div className="w-full max-w-4xl">
        <button
          className="w-full bg-neutral-800 rounded-full py-2 px-4 flex items-center justify-center gap-2 mb-6"
          onClick={() => setAdvancedOpen(!advancedOpen)}
        >
          Advanced {advancedOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {advancedOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* ROTOR POSITIONS */}
            <div className="bg-neutral-800 rounded-md p-3 flex flex-col items-center">
              <span>Rotor Positions</span>
              <div className="flex gap-2 mt-2">
                {[0, 1, 2].map((idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-neutral-700 rounded-sm flex items-center justify-center text-white"
                    onClick={() => {
                      updateRotorValue(idx, (rotorPositions[idx] % 26) + 1);
                    }}
                  >
                    {rotorPositions[idx]}
                  </Button>
                ))}
              </div>
            </div>

            {/* REFLECTOR */}
            <div className="bg-neutral-800 rounded-md p-3 flex items-center justify-between">
              <span>Reflector</span>
              <div className="flex-1 mx-4">
                <select
                  value={reflectorName}
                  onChange={(e) => setReflectorName(e.target.value)}
                  className="w-full bg-neutral-700 text-white rounded-md p-2"
                >
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            {/* ROTOR SELECTION */}
            <div className="bg-neutral-800 rounded-md p-3 flex flex-col items-center">
              <span>Rotor Selection</span>
              <div className="flex gap-2 mt-2">
                {[0, 1, 2].map((idx) => {
                  const rotorOptions = ["I", "II", "III", "IV", "V"];
                  return (
                    <select
                      key={idx}
                      value={selectedRotors[idx]}
                      onChange={(e) => {
                        updateRotorSelection(idx, e.target.value);
                      }}
                      className="w-16 bg-neutral-700 text-white rounded-md p-2"
                    >
                      {rotorOptions.map((rotorOption) => (
                        <option key={rotorOption} value={rotorOption}>
                          {rotorOption}
                        </option>
                      ))}
                    </select>
                  );
                })}
              </div>
            </div>

            {/* RING SETTINGS */}
            <div className="bg-neutral-800 rounded-md p-3 flex flex-col items-center">
              <span>Ring Settings</span>
              <div className="flex gap-2 mt-2">
                {[0, 1, 2].map((idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-neutral-700 rounded-sm flex items-center justify-center text-white"
                    onClick={() => {
                      updateRingSetting(idx, (ringSettings[idx] % 26) + 1);
                    }}
                  >
                    {ringSettings[idx]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-md p-3 flex items-center justify-between">
              <span>Plugboard Connections</span>
              {/* TODO: Add plugboard setting  (left out on purpose for simplicity) */}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl mt-8 bg-neutral-900 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Message</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearText} className="text-xs bg-neutral-800 border-0">
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(outputText)}
              className="text-xs bg-neutral-800 border-0"
            >
              Copy Output
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Input</h3>
            <div className="bg-neutral-800 rounded-md p-4 min-h-[100px] font-mono break-all">
              {inputText || "Type on your keyboard to see input here..."}
            </div>
          </div>
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Encrypted Output</h3>
            <div className="bg-neutral-800 rounded-md p-4 min-h-[100px] font-mono break-all">
              {outputText || "Encrypted text will appear here..."}
            </div>
          </div>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white">
              <Info size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              This is an Enigma machine simulator. Type on your keyboard or click the keys to see the encryption in
              action.
            </p>
          </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    </div>
  );
}