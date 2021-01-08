import { Cells } from './Cells';
import { Cell } from './cells/cell';
import { PythonCell } from './plugins/builtin/pythonCell';
import { PyodideWrapper } from './pyodideWrapper';

class CellManager {
    cells: Cell[];
    activeCell: Cell | null;
    pyodideWrapper: PyodideWrapper;
    container: HTMLElement;
    typeSelector: HTMLSelectElement;
    constructor() {
        this.cells = [];
        this.activeCell = null;
        this.pyodideWrapper = new PyodideWrapper();
        this.container = document.body.querySelector(".notebook") as HTMLElement;
        this.typeSelector = document.querySelector("#cell-type") as HTMLSelectElement;
    }
    assertNever(t: string): never {
        throw new Error("Unknown Cell Type: " + t);
    }

    createCellContainer(): HTMLElement {
        const cellContainer: HTMLElement = document.createElement("div");
        this.container.appendChild(cellContainer);
        return cellContainer;
    }

    //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
    deleteCell(cell: Cell | null): void {
        if (cell == null)
            return;
        const idx = this.cells.indexOf(cell);
        if (idx > -1) {
            this.container.removeChild(cell.container);
            this.cells.splice(idx, 1);
        }
    }

    initializeFromType(cellContainer: HTMLElement, cellType: string, cellContent: string): Cell {
        return new Cells.builtins[cellType](cellContainer,cellType,cellContent);
    }

    runCell(c: CodeMirror.Editor | Cell): void {
        if (c instanceof Cell) {
            c.runCell();
            return;
        }
        this.cells.forEach(cell => {
            if (cell.editor == c) {
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
        this.typeSelector.value = cell.type;
    }

    toJSON(): CellManagerSerialized {
        return {
            cells: this.cells
        }
    }
    moveCell(c: Cell, from: number, to: number): void {
        //TODO
        return;
    }
    render(): void {
        var frag: DocumentFragment = document.createDocumentFragment();
        this.cells.forEach((cell)=>{
            this.container.appendChild(cell.container);
        });
    }
}


export { CellManager };
export interface CellManagerSerialized {
    cells: Cell[];
}