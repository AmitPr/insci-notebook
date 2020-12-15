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
    container: HTMLElement;
    constructor() {
        this.cells = [];
        this.activeCell = null;
        this.pyodideWrapper = new PyodideWrapper();
        this.container = document.body.querySelector(".grid") as HTMLElement;
        window.cellManager = this;
    }
    assertNever(t: string): never {
        throw new Error("Unknown Cell Type: " + t);
    }

    createCellContainer(): HTMLElement {
        const cellContainer: HTMLElement = document.createElement("div");
        cellContainer.classList.add("start-sm-1", "end-sm-4", "start-md-2", "end-md-8", "start-lg-2", "end-lg-10");
        this.container.appendChild(cellContainer);
        return cellContainer;
    }

    //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    createCell(cell: any): void {
        const cellType: string = cell["type"];
        const cellContent: string = cell["content"].join("\n");
        const cellContainer: HTMLElement = this.createCellContainer();
        this.cells.push(this.initializeFromType(cellContainer, cellType, cellContent));
    }
    newCell(cell: Cell | null, type: string): void {
        if (cell != null) {
            const c: Cell = this.initializeFromType(cell.container, type, cell.content);
            this.cells[this.cells.indexOf(cell)] = c;
        } else {
            const cellContainer: HTMLElement = this.createCellContainer();
            const c: Cell = new PythonCell(cellContainer, "python", "");
            this.cells.push(c);
        }
    }

    initializeFromType(cellContainer: HTMLElement, cellType: string, cellContent: string): Cell {
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
        return c;
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
        if (this.activeCell != null) {
            this.activeCell.container.classList.remove('cell-selected');
        }
        this.activeCell = cell;
        this.activeCell.container.classList.add('cell-selected');
    }
}


export { CellManager };