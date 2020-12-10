import { Cell } from "./cell";

import marked from 'marked';

class MarkdownCell extends Cell {
    constructor(container: HTMLElement, type: string, content: string) {
        super(container, type, content);
    }
    renderOutput() : void {
        this.outputWrapper.innerHTML = marked(this.editor.getValue());
        this.toggleEditorDisplay(true);
    }
}

export { MarkdownCell }