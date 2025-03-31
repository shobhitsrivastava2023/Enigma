// enigma.ts
import { Rotor } from './rotor';
import { Reflector } from './reflector';
import { Plugboard } from './plugboard';

interface RotorConfig {
    rotors: string[];
    reflectorName: string;
    rotorPositions: number[];
    ringSettings: number[];
    plugboardConnections: string;
}

export class EnigmaMachine {
    private readonly leftRotor: Rotor;
    private readonly middleRotor: Rotor;
    private readonly rightRotor: Rotor;
    private readonly reflector: Reflector;
    private readonly plugboard: Plugboard;

    constructor(config: RotorConfig) {
        this.validateConfiguration(config);

        this.leftRotor = Rotor.Create(config.rotors[0], config.rotorPositions[0], config.ringSettings[0]);
        this.middleRotor = Rotor.Create(config.rotors[1], config.rotorPositions[1], config.ringSettings[1]);
        this.rightRotor = Rotor.Create(config.rotors[2], config.rotorPositions[2], config.ringSettings[2]);
        this.reflector = Reflector.Create(config.reflectorName);
        this.plugboard = new Plugboard(config.plugboardConnections);
    }

    private validateConfiguration(config: RotorConfig): void {
        if (!config.rotors || config.rotors.length !== 3) {
            throw new Error('Exactly 3 rotors must be specified');
        }
        if (!config.rotorPositions || config.rotorPositions.length !== 3) {
            throw new Error('Exactly 3 rotor positions must be specified');
        }
        if (!config.ringSettings || config.ringSettings.length !== 3) {
            throw new Error('Exactly 3 ring settings must be specified');
        }
        if (!config.reflectorName) {
            throw new Error('Reflector name must be specified');
        }
    }

    private rotate(): void {
        // If middle rotor notch - double-stepping
        if (this.middleRotor.isAtNotch()) {
            this.middleRotor.turnover();
            this.leftRotor.turnover();
        }
        // If right rotor notch
        else if (this.rightRotor.isAtNotch()) {
            this.middleRotor.turnover();
        }

        // Increment right-most rotor
        this.rightRotor.turnover();
    }

    private encrypt(charCode: number): number {
        this.rotate();

        // Plugboard in
        let current = this.plugboard.forward(charCode);

        // Right to left
        current = this.rightRotor.forward(current);
        current = this.middleRotor.forward(current);
        current = this.leftRotor.forward(current);

        // Reflector
        current = this.reflector.forward(current);

        // Left to right
        current = this.leftRotor.backward(current);
        current = this.middleRotor.backward(current);
        current = this.rightRotor.backward(current);

        // Plugboard out
        return this.plugboard.forward(current);
    }

    public encryptChar(char: string): string {
        if (!char || char.length !== 1) {
            throw new Error('Input must be a single character');
        }

        const charCode = char.toUpperCase().charCodeAt(0);
        if (charCode < 65 || charCode > 90) {
            return char; // Return non-A-Z characters unchanged
        }
        return String.fromCharCode(this.encrypt(charCode - 65) + 65);
    }

    public encryptMessage(input: string): string {
        if (!input) {
            return '';
        }

        let output = ''; // Initialize output
        for (const char of input) {
            output += this.encryptChar(char);
        }
        return output;
    }
    public getLeftRotorPosition(): number {
        return this.leftRotor.rotorPosition;
    }

    public getMiddleRotorPosition(): number {
        return this.middleRotor.rotorPosition;
    }

    public getRightRotorPosition(): number {
        return this.rightRotor.rotorPosition;
    }
}