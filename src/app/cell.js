import { render, html } from 'uhtml';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';

import './codemirror-modes/markdown.js';
import './codemirror-modes/python.js';

import marked from 'marked';

import '../style/one-theme.css';

class Cell {
    constructor(container, type, content) {
        this.container = container;
        this.type = type;
        this.content = content;
        render(this.container, html`
        <div>
            <textarea id="cm-textarea">${this.content}</textarea>
            <div class = "cell-output"></div>
        </div>`);
        this.editor = this.initCodeMirror();
        this.editor.getWrapperElement().style.display='block';
        this.outputWrapper = this.container.querySelector(".cell-output");
        this.renderOutput();
    }

    renderOutput(){
        switch(this.type){
            case 'markdown':
                this.outputWrapper.innerHTML=marked(this.editor.getValue());
                this.toggleEditorDisplay(true);
                break;
            case 'python':
                break;
            default:
                break;
        }
    }

    toggleEditorDisplay(forceHide=false){
        var wrapper = this.editor.getWrapperElement();
        if(wrapper.style.display=='block' || forceHide){
            wrapper.style.display='none';
        }else{
            wrapper.style.display='block';
        }
    }

    initCodeMirror() {
        var editor = CodeMirror.fromTextArea(this.container.querySelector("#cm-textarea"), {
            mode: {
                name: this.type,
                version: 3,
                singleLineStringErrors: false,
                fencedCodeBlockDefaultMode: 'python'
            },
            extraKeys: {
                'Tab': function (cm) {
                    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                    cm.replaceSelection(spaces);
                },
                'Shift-Enter': function (cm) {
                    cm.cell.renderOutput();
                },
            },
            indentUnit: 4,
            matchBrackets: true,
            theme: 'one-theme',
            scrollbarStyle: 'overlay',
            viewportMargin: Infinity,
            lineNumbers: true,
        });
        editor.cell=this;
        return editor;
    }
}

export { Cell };