window.languagePluginUrl = 'https://pyodide-cdn2.iodide.io/v0.15.0/full/'
class CellManager {
    constructor() {
        this.pyodide = new PyodideWrapper();
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
                delimiters:[
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true }
                ]
        });
    }
}

class Cell {
    constructor(type) {
        this.type = type;
    }
}