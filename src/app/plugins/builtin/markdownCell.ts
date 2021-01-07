import { Cell } from "../../cells/cell";

import marked from 'marked';
import katex from 'katex';

class MarkdownCell extends Cell {
    constructor(container: HTMLElement, type: string, content: string) {
        super(container, type, content);
        this.container.ondblclick = () => this.setEditMode(true);
        this.runCell();
    }
    runCell(): void {
        let formatted: string;
        if(!this.content)
        formatted = marked("*Empty markdown cell*");
        else
            formatted = marked(this.content);
            
        //formatted = katex.renderToString(formatted);
        this.outputWrapper.innerHTML = formatted;
        this.setEditMode(false);
    }
    setEditMode(active: boolean): void {
        if(active) {
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