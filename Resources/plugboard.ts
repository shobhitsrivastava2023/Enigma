// plugboard.ts
export class Plugboard {
    private readonly wiring: number[];

    constructor(connections: string) {
        this.wiring = Plugboard.decodePlugboard(connections);
    }

    public forward(c: number): number {
        return this.wiring[c];
    }

    private static identityPlugboard(): number[] {
        const mapping: number[] = new Array(26);
        for (let i = 0; i < 26; i++) {
            mapping[i] = i;
        }
        return mapping;
    }

    public static getUnpluggedCharacters(plugboard: string): Set<number> {
        const unpluggedCharacters: Set<number> = new Set<number>();
        for (let i = 0; i < 26; i++) {
            unpluggedCharacters.add(i);
        }

        if (!plugboard) {
            return unpluggedCharacters;
        }

        const pairings = plugboard.split(/[^a-zA-Z]/);

        for (const pair of pairings) {
            if (pair.length === 2) {
                const c1 = pair.charCodeAt(0) - 65;
                const c2 = pair.charCodeAt(1) - 65;

                unpluggedCharacters.delete(c1);
                unpluggedCharacters.delete(c2);
            }
        }

        return unpluggedCharacters;
    }

    public static decodePlugboard(plugboard: string): number[] {
        if (!plugboard) {
            return Plugboard.identityPlugboard();
        }

        const pairings = plugboard.split(/[^a-zA-Z]/);
        const pluggedCharacters: Set<number> = new Set<number>();
        const mapping: number[] = Plugboard.identityPlugboard();

        for (const pair of pairings) {
            if (pair.length !== 2) {
                return Plugboard.identityPlugboard();
            }

            const c1 = pair.charCodeAt(0) - 65;
            const c2 = pair.charCodeAt(1) - 65;

            if (pluggedCharacters.has(c1) || pluggedCharacters.has(c2)) {
                return Plugboard.identityPlugboard();
            }

            pluggedCharacters.add(c1);
            pluggedCharacters.add(c2);

            mapping[c1] = c2;
            mapping[c2] = c1;
        }

        return mapping;
    }
}