import { Cell } from "./cell";

import marked from 'marked';

class MarkdownCell extends Cell {
    constructor(container: HTMLElement, type: string, content: string) {
        super(container, type, content);
        this.container.ondblclick = () => this.setEditMode(true);
        this.runCell();
    }
    runCell(): void {
        this.outputWrapper.innerHTML = marked(this.content);
        this.setEditMode(false);
    }
    setEditMode(active: boolean): void{
        if(active){
            this.outputWrapper.style.display='none';
            this.setInputDisplay(true);
        }else{
            this.outputWrapper.style.display='block';
            this.setInputDisplay(false);
        }
    }
}

export { MarkdownCell }