import { CellManager } from './app/cellManager';
import './style/main.css';

var cellManager = new CellManager();
/*
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
    notebook["cells"].forEach((cell: any) => {
        cellManager.createCell(cell);
    });
});
