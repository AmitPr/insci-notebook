import { Cell } from "../../../Cells";
import { Notebook } from "../../../Notebook";
import { Markdown } from "./Markdown";


class MarkdownCell extends Cell {
    constructor(notebook: Notebook, container: HTMLElement, type: string, content: string) {
        super(notebook, container, type, content);
        this.container.ondblclick = () => this.setEditMode(true);
        this.runCell();
    }
    runCell(): void {
        this.outputWrapper.innerHTML = Markdown.format(this.content);
        this.setEditMode(false);
    }
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