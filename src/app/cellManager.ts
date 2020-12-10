/*import PyodideWrapper from './pyodideWrapper.js';
*/

import { Cell } from './cells/cell';
import { MarkdownCell } from './cells/markdownCell';
import { PythonCell } from './cells/pythonCell';


class CellManager {
    cells: Cell[];
    constructor() {
        this.cells = [];
    }
    assertNever(t: string): never {
        throw new Error("Unkown Cell Type: " + t);
    }
    //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    createCell(cell: any): void {
        const cellType: string = cell["type"];
        const cellContent: string = cell["content"].join("\n");
        const cellContainer: HTMLElement = document.createElement('div');
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
}


export { CellManager };