export class Hazard {
    constructor(id: number, name: string, file: string, line: number) {
        this.id = id;
        this.name = name;
        this.file = file;
        this.line = line;
    }

    id: number;
    name: string;
    file: string;
    line: number;
}