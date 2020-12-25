import { Cell } from "./cell";
import { render, html } from 'uhtml';

class PythonCell extends Cell {
    inputStatus: HTMLElement;
    outputStatus: HTMLElement;
    constructor(container: HTMLElement, type: string, content: string) {
        super(container, type, content);
        this.inputStatus = this.container.querySelector(".py-input-status") as HTMLElement;
        this.outputStatus = this.container.querySelector(".py-output-status") as HTMLElement;
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
    renderCell(): void {
        render(this.container, html`
        <div class = "py-input-status"></div>
        <div class = "cell-input">
            <textarea id="cm-textarea">${this.content}</textarea>
        </div>
        <div class = "py-output-status"></div>
        <div class = "cell-output"></div>
        `);
    }
    setStatus(type: string, status: number): void {
        if (type == "input") {
            this.inputStatus.innerHTML=`In[${status}]:`;
        } else if (type == "output") {
            this.outputStatus.innerHTML=`Out[${status}]:`;
        } else {
            throw new Error("Status type not found: " + type);
        }
    }
}

export { PythonCell }