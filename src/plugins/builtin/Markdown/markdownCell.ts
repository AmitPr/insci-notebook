import { Cell } from "../../../Cells";
import { Notebook } from "../../../Notebook";
import { Markdown } from "./Markdown";

/**
 * Markdown cell, part of the [[Markdown]] plugin. Extends from [[Cell]].
 */
class MarkdownCell extends Cell {
    constructor(notebook: Notebook, container: HTMLElement, type: string, content: string) {
        super(notebook, container, type, content);
        this.container.ondblclick = () => this.setEditMode(true);
        this.runCell();
    }
    /**
     * Runs cell using [[Markdown.format]].
     */
    runCell(): void {
        this.outputWrapper.innerHTML = Markdown.format(this.content);
        this.setEditMode(false);
    }
    /**
     * Wrapper for the `setInputDisplay()` function which changes output wrapper display.
     * @param active On/off boolean.
     */
    setEditMode(active: boolean): void {
        if (active) {
            this.outputWrapper.style.display = 'none';
            this.setInputDisplay(true);
            this.editor.focus();
        } else {
            this.outputWrapper.style.display = 'block';
            this.setInputDisplay(false);
        }
    }
}

export { MarkdownCell }