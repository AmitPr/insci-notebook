import { CellManager } from './notebook';
import { toggleTheme, currentTheme } from '../style/styler';
import { Button } from './component/button';
import dayNightToggle from '../static/day-night-toggle.svg';
import plusCircle from '../static/plus-circle.svg';
import trash from '../static/trash.svg';
import arrowUp from '../static/arrow-up.svg';
import arrowDown from '../static/arrow-down.svg';
import run from '../static/run.svg';
import '../style/main.less';

class App {
    private static inst: App;
    public cellManager: CellManager;
    private constructor() {
        this.cellManager = new CellManager();
        const notebook = { "cells": [{ "type": "markdown", "content": ["# h1 Heading", "## h2 Heading", "### h3 Heading", "#### h4 Heading", "##### h5 Heading", "###### h6 Heading", "", "", "## Horizontal Rules", "", "___", "", "---", "", "***", "", "", "", "## Emphasis", "", "**This is bold text**", "", "__This is bold text__", "", "*This is italic text*", "", "_This is italic text_", "", "~~Strikethrough~~", "", "", "## Blockquotes", "", "", "> Blockquotes can also be nested...", ">> ...by using additional greater-than signs right next to each other...", "> > > ...or with spaces between arrows.", "", "", "## Lists", "", "Unordered", "", "+ Create a list by starting a line with `+`, `-`, or `*`", "+ Sub-lists are made by indenting 2 spaces:", "  - Marker character change forces new list start:", "    * Ac tristique libero volutpat at", "    + Facilisis in pretium nisl aliquet", "    - Nulla volutpat aliquam velit", "+ Very easy!", "", "Ordered", "", "1. Lorem ipsum dolor sit amet", "2. Consectetur adipiscing elit", "3. Integer molestie lorem at massa", "", "", "1. You can use sequential numbers...", "1. ...or keep all the numbers as `1.`", "", "Start numbering with offset:", "", "57. foo", "1. bar", "", "", "## Code", "", "Inline `code`", "", "Indented code", "", "    // Some comments", "    line 1 of code", "    line 2 of code", "    line 3 of code", "", "", "Block code \"fences\"", "", "```", "Sample text here...", "```", "", "Syntax highlighting", "", "``` js", "var foo = function (bar) {", "  return bar++;", "};", "", "console.log(foo(5));", "```", "", "## Tables", "", "| Option | Description |", "| ------ | ----------- |", "| data   | path to data files to supply the data that will be passed into templates. |", "| engine | engine to be used for processing templates. Handlebars is the default. |", "| ext    | extension to be used for dest files. |", "", "Right aligned columns", "", "| Option | Description |", "| ------:| -----------:|", "| data   | path to data files to supply the data that will be passed into templates. |", "| engine | engine to be used for processing templates. Handlebars is the default. |", "| ext    | extension to be used for dest files. |"] }, { "type": "python", "content": ["x=1", "print(x)"] }] };

        notebook["cells"].forEach((cell: any) => {
            this.cellManager.createCell(cell);
        });
        if (document.querySelector(".button-theme-toggle")) {
            const themeToggleContainer: HTMLElement = document.querySelector(".button-theme-toggle") as HTMLElement;
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

                window.setTimeout(() => {
                    document.documentElement.setAttribute("data-state", "");
                }, 250);
            }
            const themeToggleButton: Button = new Button(themeToggleContainer, dayNightToggle, () => {
                toggleTheme();
                animate();
            });
            animate();
        }
        if (document.querySelector(".button-new-cell")) {
            const newButtonContainer: HTMLElement = document.querySelector(".button-new-cell") as HTMLElement;
            const newCellButton: Button = new Button(newButtonContainer, plusCircle, () => {
                this.cellManager.newCell(null, "python");
            });
        }

        if (document.querySelector(".button-delete-cell")) {
            const deleteButtonContainer: HTMLElement = document.querySelector(".button-delete-cell") as HTMLElement;
            const deleteCellButton: Button = new Button(deleteButtonContainer, trash, () => {
                this.cellManager.deleteCell(this.cellManager.activeCell);
            });
        }

        if (document.querySelector(".button-move-up-cell")) {
            const moveCellUpContainer: HTMLElement = document.querySelector(".button-move-up-cell") as HTMLElement;
            const moveCellUpButton: Button = new Button(moveCellUpContainer, arrowUp, () => {
                if (this.cellManager.activeCell) {
                    const index: number = this.cellManager.cells.indexOf(this.cellManager.activeCell);
                    const tmp = this.cellManager.cells.splice(index, 1)[0];
                    this.cellManager.cells.splice(index - 1, 0, tmp);
                    this.cellManager.render();
                }
            });
        }

        if (document.querySelector(".button-move-down-cell")) {
            const moveCellDownContainer: HTMLElement = document.querySelector(".button-move-down-cell") as HTMLElement;
            const moveCellDownButton: Button = new Button(moveCellDownContainer, arrowDown, () => {
                if (this.cellManager.activeCell) {
                    const index: number = this.cellManager.cells.indexOf(this.cellManager.activeCell);
                    const tmp = this.cellManager.cells.splice(index, 1)[0];
                    this.cellManager.cells.splice(index + 1, 0, tmp);
                    this.cellManager.render();
                }
            });
        }

        if (document.querySelector(".button-run-cell")) {
            const runCellContainer: HTMLElement = document.querySelector(".button-run-cell") as HTMLElement;
            const runCellButton: Button = new Button(runCellContainer, run, () => {
                if (this.cellManager.activeCell) {
                    this.cellManager.runCell(this.cellManager.activeCell);
                }
            });
        }

        
        if (document.querySelector("#cell-type")) {
            const cellTypeSelect: HTMLSelectElement = document.querySelector("#cell-type") as HTMLSelectElement;
            cellTypeSelect.onchange=(e:Event)=>{App.inst.cellManager.newCell(App.inst.cellManager.activeCell,(e.currentTarget as HTMLSelectElement).value);}
        }

    }
    public static instance(): App {
        if (!this.inst) {
            this.inst = new App();
        }
        return this.inst;
    }
}

//Mount the App
document.addEventListener("DOMContentLoaded", function () {
    const app: App = App.instance();
});

export { App };