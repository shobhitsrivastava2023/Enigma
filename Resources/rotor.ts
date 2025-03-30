// rotor.ts
export class Rotor {
    public name: string;
    public forwardWiring: number[];
    public backwardWiring: number[];
    public rotorPosition: number;
    public notchPosition: number;
    public ringSetting: number;

    constructor(
        name: string,
        encoding: string,
        rotorPosition: number,
        notchPosition: number,
        ringSetting: number
    ) {
        this.name = name;
        this.forwardWiring = this.decodeWiring(encoding);
        this.backwardWiring = this.inverseWiring(this.forwardWiring);
        this.rotorPosition = rotorPosition;
        this.notchPosition = notchPosition;
        this.ringSetting = ringSetting;
    }

    static Create(name: string, rotorPosition: number, ringSetting: number): Rotor {
        switch (name) {
            case "I":
                return new Rotor("I", "EKMFLGDQVZNTOWYHXUSPAIBRCJ", rotorPosition, 16, ringSetting);
            case "II":
                return new Rotor("II", "AJDKSIRUXBLHWTMCQGZNPYFVOE", rotorPosition, 4, ringSetting);
            case "III":
                return new Rotor("III", "BDFHJLCPRTXVZNYEIWGAKMUSQO", rotorPosition, 21, ringSetting);
            case "IV":
                return new Rotor("IV", "ESOVPZJAYQUIRHXLNFTGKDCMWB", rotorPosition, 9, ringSetting);
            case "V":
                return new Rotor("V", "VZBRGITYUPSDNHLXAWMJQOFECK", rotorPosition, 25, ringSetting);
            case "VI": {
                const rotor = new Rotor("VI", "JPGVOUMFYQBENHZRDKASXLICTW", rotorPosition, 0, ringSetting);
                rotor.isAtNotch = function (): boolean {
                    return this.rotorPosition === 12 || this.rotorPosition === 25;
                };
                return rotor;
            }
            case "VII": {
                const rotor = new Rotor("VII", "NZJHGRCXMYSWBOUFAIVLPEKQDT", rotorPosition, 0, ringSetting);
                rotor.isAtNotch = function (): boolean {
                    return this.rotorPosition === 12 || this.rotorPosition === 25;
                };
                return rotor;
            }
            case "VIII": {
                const rotor = new Rotor("VIII", "FKQHTLXOCBJSPDZRAMEWNIUYGV", rotorPosition, 0, ringSetting);
                rotor.isAtNotch = function (): boolean {
                    return this.rotorPosition === 12 || this.rotorPosition === 25;
                };
                return rotor;
            }
            default:
                return new Rotor("Identity", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", rotorPosition, 0, ringSetting);
        }
    }

    getName(): string {
        return this.name;
    }

    getPosition(): number {
        return this.rotorPosition;
    }

    protected decodeWiring(encoding: string): number[] {
        const charWiring = encoding.split('');
        const wiring = new Array<number>(charWiring.length);
        for (let i = 0; i < charWiring.length; i++) {
            wiring[i] = charWiring[i].charCodeAt(0) - 65;
        }
        return wiring;
    }

    protected inverseWiring(wiring: number[]): number[] {
        const inverse = new Array<number>(wiring.length);
        for (let i = 0; i < wiring.length; i++) {
            const forward = wiring[i];
            inverse[forward] = i;
        }
        return inverse;
    }

    protected encipher(k: number, pos: number, ring: number, mapping: number[]): number {
        const shift = pos - ring;
        return (mapping[(k + shift + 26) % 26] - shift + 26) % 26;
    }

    forward(c: number): number {
        return this.encipher(c, this.rotorPosition, this.ringSetting, this.forwardWiring);
    }

    backward(c: number): number {
        return this.encipher(c, this.rotorPosition, this.ringSetting, this.backwardWiring);
    }

    isAtNotch(): boolean {
        return this.notchPosition === this.rotorPosition;
    }

    turnover(): void {
        this.rotorPosition = (this.rotorPosition + 1) % 26;
    }
}