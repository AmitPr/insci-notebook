/*import PyodideWrapper from './pyodideWrapper.js';
*/

import { Cell } from './cells/cell';
import { MarkdownCell } from './cells/markdownCell';
import { PythonCell } from './cells/pythonCell';
import { PyodideWrapper } from './pyodideWrapper';


declare global {
    interface Window { cellManager: CellManager; }
}

class CellManager {
    cells: Cell[];
    activeCell: Cell | null;
    pyodideWrapper: PyodideWrapper;
    constructor() {
        this.cells = [];
        this.activeCell=null;
        this.pyodideWrapper = new PyodideWrapper();
        window.cellManager = this;
    }
    assertNever(t: string): never {
        throw new Error("Unkown Cell Type: " + t);
    }
    //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    createCell(cell: any): void {
        const cellType: string = cell["type"];
        const cellContent: string = cell["content"].join("\n");
        const cellContainer: HTMLElement = document.createElement("div");
        document.body.appendChild(cellContainer);
        let c: Cell;
        switch (cellType) {
            case "markdown":
                c = new MarkdownCell(cellContainer, cellType, cellContent);
                break;
            case "python":
                c = new PythonCell(cellContainer, cellType, cellContent);
                break;
            default:
                this.assertNever(cellType);
                break;
        }
        this.cells.push(c);
    }
    newCell(): void {
        const cellContainer: HTMLElement = document.createElement("div");
        document.body.appendChild(cellContainer);
        const c: Cell = new PythonCell(cellContainer, "python", "");
        this.cells.push(c);
    }

    runCell(cm: CodeMirror.Editor): void {
        this.cells.forEach(cell => {
            if (cell.editor == cm) {
                cell.runCell();
                return;
            }
        });
    }

    setActiveCell(cell: Cell): void {
        if(this.activeCell!=null){
            this.activeCell.container.classList.remove('cell-selected');
        }
        this.activeCell=cell;
        this.activeCell.container.classList.add('cell-selected');
    }
}


export { CellManager };