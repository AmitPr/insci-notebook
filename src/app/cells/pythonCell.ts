import { Cell } from "./cell";

class PythonCell extends Cell {
    constructor(container: HTMLElement, type: string, content: string) {
        super(container, type, content);
    }
    renderOutput() {
    }
}

export { PythonCell }