import { render, html } from 'uhtml';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';

import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';

import '../codemirror-modes/markdown.js';
import '../codemirror-modes/python.js';


import '../../style/one-theme.css';

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
        if(this.editor===undefined){
            return this._content;
        }
        return this.editor.getValue();
    }
    set content(value: string) {
        this.editor.setValue(value);
    }

    editor: CodeMirror.Editor;
    outputWrapper: HTMLElement;

    constructor(container: HTMLElement, type: string, content: string) {
        CodeMirror.fromTextArea
        this.container = container;
        this._type = type;
        this._content=content;
        this.renderCell();
        this.editor = this.initCodeMirror(content);
        this.setEditorDisplay(true);
        this.outputWrapper = this.container.querySelector(".cell-output") as HTMLElement;
    }

    abstract runCell(): void;

    renderCell(): void {
        render(this.container, html`
        <div>
            <textarea id="cm-textarea">${this.content}</textarea>
            <div class = "cell-output"></div>
        </div>`);
    }

    setEditorDisplay(visible = false): void {
        const wrapper = this.editor.getWrapperElement();
        if (visible) {
            wrapper.style.display = 'block';
        } else {
            wrapper.style.display = 'none';
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