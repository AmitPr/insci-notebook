import { CellManager } from "../cellManager";
import { Cell } from "./cell";

class PythonCell extends Cell {
    constructor(container: HTMLElement, type: string, content: string) {
        super(container, type, content);
    }
    runCell(): void {
        window.cellManager.pyodideWrapper.runPython(this);
        return;
    }
    resetOutput(): void {
        this.outputWrapper.innerHTML = "";
    }
    appendToOutput(output: string): void {
        this.outputWrapper.innerHTML += output;
    }
}

export { PythonCell }