// components/EnigmaForm.tsx
"use client"
import React, { useState, useRef } from 'react';
import { EnigmaMachine } from '../../../Resources/enigma'; // Adjust path as needed

interface EnigmaFormProps {
    onProcess: (message: string) => void;
}

const EnigmaForm: React.FC<EnigmaFormProps> = ({ onProcess }) => {
    const [rotors, setRotors] = useState(['I', 'II', 'III']);
    const [reflectorName, setReflectorName] = useState('B');
    const [rotorPositions, setRotorPositions] = useState([1, 3, 2]);
    const [ringSettings, setRingSettings] = useState([0, 0, 0]);
    const [plugboardConnections, setPlugboardConnections] = useState('');
    const [message, setMessage] = useState('');
    const [isDecrypt, setIsDecrypt] = useState(false);
    const enigmaRef = useRef<EnigmaMachine | null>(null);

    const handleProcess = () => {
        try {
         
            const config = {
                rotors: rotors,
                reflectorName: reflectorName,
                rotorPositions: rotorPositions,
                ringSettings: ringSettings,
                plugboardConnections: plugboardConnections,
            };

            
            enigmaRef.current = new EnigmaMachine(config);

            // 3. Force the Enigma to advance the rotors manually.
            //    Note that calling encryptChar or encryptMessage implicitly calls rotate()
            //    so if we want to ensure the values will change, we need to force to rotate many times
            for (let i = 0; i < 3; i++) {
                enigmaRef.current.encryptChar('A');  // Or any character.  Just call it repeatedly to turn the rotors
            }

           
            const processedMessage = enigmaRef.current!.encryptMessage(message);

            
            const newRotorPositions = [
                enigmaRef.current.leftRotor.rotorPosition,
                enigmaRef.current.middleRotor.rotorPosition,
                enigmaRef.current.rightRotor.rotorPosition,
            ];

            // 6. Use the setRotorPositions function so react updates the component
            setRotorPositions(newRotorPositions)

            onProcess(processedMessage);

        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Enigma Machine</h2>
            <div>
                <label>Decrypt:</label>
                <input
                    type="checkbox"
                    checked={isDecrypt}
                    onChange={(e) => setIsDecrypt(e.target.checked)}
                />
            </div>
            <div>
                <label>Rotors (e.g., I II III):</label>
                <input
                    type="text"
                    value={rotors.join(' ')}
                    onChange={(e) => setRotors(e.target.value.toUpperCase().split(' '))}
                />
            </div>
            <div>
                <label>Reflector (B or C):</label>
                <input
                    type="text"
                    value={reflectorName}
                    onChange={(e) => setReflectorName(e.target.value.toUpperCase())}
                />
            </div>
            <div>
                <label>Rotor Positions (e.g., 0 0 0):</label>
                <input
                    type="text"
                    value={rotorPositions.join(' ')}
                    onChange={(e) => setRotorPositions(e.target.value.split(' ').map(Number))}
                />
            </div>
            <div>
                <label>Ring Settings (e.g., 0 0 0):</label>
                <input
                    type="text"
                    value={ringSettings.join(' ')}
                    onChange={(e) => setRingSettings(e.target.value.split(' ').map(Number))}
                />
            </div>
            <div>
                <label>Plugboard Connections (e.g., AB CD EF):</label>
                <input
                    type="text"
                    value={plugboardConnections}
                    onChange={(e) => setPlugboardConnections(e.target.value.toUpperCase())}
                />
            </div>
            <div>
                <label>Message:</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value.toUpperCase())} />
            </div>
            <button onClick={handleProcess}>Process</button>
            <p>Current Rotor Positions: {rotorPositions.join(' ')}</p>
        </div>
    );
};

export default EnigmaForm;