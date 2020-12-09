import { CellManager } from './app/cellManager';
var cellManager = new CellManager();
/*
window.toggleMarkdownCell = function (e) {
    e.parentNode.querySelector('.Cell-MarkdownSource').style.display = '';
    e.parentNode.querySelector('.CodeMirror').CodeMirror.refresh();
    e.style.display = 'none';
}
function renderLaTeX() {
    window.renderMathInElement(document.body,
        {
            ignoredTags: [],
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
            ]
        });
}*/
document.addEventListener("DOMContentLoaded", function () {
    var notebook = {
        "cells": [
            {
                "type": "markdown",
                "content": [
                    "# Test  ",
                    "*test* and **test** and ***test***!"
                ]
            },
            {
                "type": "python",
                "content": [
                    "x=1",
                    "print(x)"
                ]
            }
        ]
    }
    notebook["cells"].forEach((cell) => {
        cellManager.createCell(cell);
    });

});
