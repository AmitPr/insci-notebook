import { Cell } from '../../../Cells';
import { Notebook } from "../../../Notebook";
import { render, html } from 'uhtml';

/**
 * Python cell, part of the [[Python]] plugin. Extends from [[Cell]].
 */
class PythonCell extends Cell {
    /** Reference to an HTMLElement in which the input status is displayed. */
    inputStatus: HTMLElement;
    /** Reference to an HTMLElement in which the input status is displayed. */
    outputStatus: HTMLElement;
    constructor(notebook: Notebook, container: HTMLElement, type: string, content: string) {
        super(notebook, container, type, content);
        this.inputStatus = this.container.querySelector(".py-input-status") as HTMLElement;
        this.outputStatus = this.container.querySelector(".py-output-status") as HTMLElement;
    }
    /**
     * Runs cell using pyodide.
     */
    runCell(): void {
        this.notebook.pyodideWrapper.runPython(this);
        return;
    }
    /**
     * Reset the output of a previous run.
     */
    resetOutput(): void {
        this.outputWrapper.innerHTML = "";
    }
    /**
     * Appends a string to the output of this cell.
     * @param output A string to append.
     */
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
    /**
     * Changes the status shown in either the input or the output status trackers.
     * @param type The status type to change (input or output).
     * @param status The new status.
     */
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