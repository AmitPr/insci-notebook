import { render, html } from 'uhtml';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';

import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';

import '../codemirror-modes/markdown.js';
import '../codemirror-modes/python.js';


import '../../style/one-theme.scss';

abstract class Cell {
    container: HTMLElement;
    _content: string;

    private _type: string;
    get type(): string {
        return this._type;
    }
    set type(value: string) {
        this._type = value;
    }

    get content(): string {
        if (this.editor === undefined) {
            return this._content;
        }
        return this.editor.getValue();
    }
    set content(value: string) {
        this.editor.setValue(value);
    }

    editor: CodeMirror.Editor;
    outputWrapper: HTMLElement;
    inputWrapper: HTMLElement;

    constructor(container: HTMLElement, type: string, content: string) {
        CodeMirror.fromTextArea
        this.container = container;
        this.container.classList.add("cell");
        this.container.onclick = () => {
            window.cellManager.setActiveCell(this);
        };
        this._type = type;
        this.container.dataset.language = this.type;
        this._content = content;
        this.renderCell();
        this.editor = this.initCodeMirror(content);
        this.outputWrapper = this.container.querySelector(".cell-output") as HTMLElement;
        this.inputWrapper = this.container.querySelector(".cell-input") as HTMLElement;
        this.setInputDisplay(true);
    }

    abstract runCell(): void;

    renderCell(): void {
        render(this.container, html`
        <div class = "cell-input">
            <textarea id="cm-textarea">${this.content}</textarea>
        </div>
        <div class = "cell-output"></div>
        `);
    }

    setInputDisplay(visible = false): void {
        if (visible) {
            this.inputWrapper.style.display = 'block';
        } else {
            this.inputWrapper.style.display = 'none';
        }
    }

    initCodeMirror(content: string): CodeMirror.Editor {
        const editor = CodeMirror.fromTextArea(this.container.querySelector("#cm-textarea") as HTMLTextAreaElement, {
            mode: {
                name: this.type,
                version: 3,
                singleLineStringErrors: false,
                fencedCodeBlockDefaultMode: 'python'
            },
            extraKeys: {
                'Tab': function (cm: CodeMirror.Editor) {
                    const indentUnit = cm.getOption("indentUnit") as number;
                    const spaces = Array(indentUnit + 1).join(" ");
                    cm.replaceSelection(spaces);
                },
                'Shift-Enter': function (cm: CodeMirror.Editor) {
                    window.cellManager.runCell(cm);
                    return;
                },
            },
            indentUnit: 4,
            theme: 'one-theme',
            scrollbarStyle: 'overlay',
            viewportMargin: Infinity,
            lineNumbers: true,
        });
        editor.setValue(content);
        return editor;
    }
}

export { Cell };