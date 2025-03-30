// reflector.ts
export class Reflector {
    private readonly forwardWiring: number[];

    constructor(encoding: string) {
        this.forwardWiring = Reflector.decodeWiring(encoding);
    }

    static Create(name: string): Reflector {
        switch (name) {
            case "B":
                return new Reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT");
            case "C":
                return new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL");
            default:
                return new Reflector("ZYXWVUTSRQPONMLKJIHGFEDCBA");
        }
    }

    private static decodeWiring(encoding: string): number[] {
        const wiring: number[] = new Array(encoding.length);
        for (let i = 0; i < encoding.length; i++) {
            wiring[i] = encoding.charCodeAt(i) - 65;
        }
        return wiring;
    }

    public forward(c: number): number {
        return this.forwardWiring[c];
    }
}