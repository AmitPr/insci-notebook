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
    createCell(cell: any) {
        var cellType: string = cell["type"];
        var cellContent: string = cell["content"].join("\n");
        var cellContainer: HTMLElement = document.createElement('div');
        document.body.appendChild(cellContainer);
        var c: Cell;
        switch (cellType) {
            case "markdown":
                c = new MarkdownCell(cellContainer, cellType, cellContent);
                break;
            case "python":
                c = new PythonCell(cellContainer, cellType, cellContent);
                break;
            default:
                c = new Cell(cellContainer, cellType, cellContent);
                break;
        }
        this.cells.push(c);
    }
}


export { CellManager };