/*import PyodideWrapper from './pyodideWrapper.js';
*/

import {Cell} from './cell.js';


class CellManager {
    constructor() {
        //this.pyodide = new PyodideWrapper();
        this.cells = [];
    }
    handleRunCommand(el) {
        var cell = el.closest('.Cell');
        var cm = cell.querySelector('.CodeMirror').CodeMirror;
        this.evalCell(cell, cm);
    }
    evalCell(cell, cm) {
        var cellType = cell.dataset['type'];
        switch (cellType) {
            case 'python':
                this.pyodide.runPython(cm);
                break;
            case 'markdown':
                this.runMarkdownCell(cell, cm);
                break;
            default:
                break;
        }
    }
    runMarkdownCell(cell, cm) {
        cell.querySelector(".jp-MarkdownOutput").innerHTML = marked(cm.getValue());
        cell.querySelector('.Cell-MarkdownSource').style.display = 'none';
        cell.querySelector('.jp-MarkdownOutput').style.display = '';
        window.renderMathInElement(cell.querySelector(".jp-MarkdownOutput"),
            {
                ignoredTags: [],
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true }
                ]
            });
    }
    createCell(cell) {
        var cellType = cell["type"];
        var cellContent = cell["content"].join("\n");
        var cellContainer = document.createElement('div');
        document.body.appendChild(cellContainer);
        var c = new Cell(cellContainer,cellType,cellContent);
        this.cells.push(c);
    }
}


export { CellManager };