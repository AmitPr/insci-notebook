import { CellManager } from './app/cellManager';
import { toggleTheme, currentTheme } from './style/styler';
import { Button } from './app/component/button';

import dayNightToggle from './static/day-night-toggle.svg';
import plusCircle from './static/plus-circle.svg';
import trash from './static/trash.svg';

import './style/main.scss';

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
    const cellManager = new CellManager();
    const notebook = {
        "cells": [
            {
                "type": "markdown",
                "content": [
                    "# Test  ",
                    "## Test  ",
                    "### Test  ",
                    "#### Test  ",
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
    const themeToggleContainer: HTMLElement = document.querySelector(".theme-toggle") as HTMLElement;
    const animate = function () {
        document.documentElement.setAttribute("data-state", "transition");
        if (currentTheme == "dark") {
            const elements: any[] = Array.from(themeToggleContainer.getElementsByClassName('day-night-animate'));
            elements.forEach(e => {
                e.beginElement();
            });
        } else if (currentTheme == "light") {
            const elements: any[] = Array.from(themeToggleContainer.getElementsByClassName('night-day-animate'));
            elements.forEach(e => {
                e.beginElement();
            });
        }
    }
    const themeToggleButton: Button = new Button(themeToggleContainer, dayNightToggle, () => {
        toggleTheme();
        animate();
        window.setTimeout(() => {
            document.documentElement.setAttribute("data-state", "");
        }, 250)
    });
    animate();
    const newButtonContainer: HTMLElement = document.querySelector(".button-new-cell") as HTMLElement;
    const newCellButton: Button = new Button(newButtonContainer, plusCircle, () => {
        cellManager.newCell(null, "python");
    });
    const deleteButtonContainer: HTMLElement = document.querySelector(".button-delete-cell") as HTMLElement;
    const deleteCellButton: Button = new Button(deleteButtonContainer, trash, () => {
        cellManager.deleteCell(cellManager.activeCell);
    });
});