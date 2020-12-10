import { CellManager } from './app/cellManager';
import './style/main.css';

const cellManager = new CellManager();
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
    const notebook = {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notebook["cells"].forEach((cell: any) => {
        cellManager.createCell(cell);
    });
});
