import { render, html } from 'uhtml';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';

import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';

import '../codemirror-modes/markdown.js';
import '../codemirror-modes/python.js';


import '../style/one-theme.css';

abstract class Cell {
    container: HTMLElement;
    type: string;
    content: string;
    editor: CodeMirror.Editor;
    outputWrapper: HTMLElement;
    constructor(container: HTMLElement, type: string, content: string) {
        CodeMirror.fromTextArea
        this.container = container;
        this.type = type;
        this.content = content;
        render(this.container, html`
        <div>
            <textarea id="cm-textarea">${this.content}</textarea>
            <div class = "cell-output"></div>
        </div>`);
        this.editor = this.initCodeMirror();
        this.editor.getWrapperElement().style.display = 'block';
        this.outputWrapper = this.container.querySelector(".cell-output") as HTMLElement;
        this.renderOutput();
    }

    abstract renderOutput(): void;

    toggleEditorDisplay(forceHide = false) : void{
        const wrapper = this.editor.getWrapperElement();
        if (wrapper.style.display == 'block' || forceHide) {
            wrapper.style.display = 'none';
        } else {
            wrapper.style.display = 'block';
        }
    }

    initCodeMirror() : CodeMirror.Editor{
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
                    return;
                },
            },
            indentUnit: 4,
            theme: 'one-theme',
            scrollbarStyle: 'overlay',
            viewportMargin: Infinity,
            lineNumbers: true,
        });
        return editor;
    }
}

export { Cell };