import { render, html } from 'uhtml';
import CodeMirror from './codemirror/codemirror';

import './codemirror/codemirror.css';

import './codemirror/addon/simplescrollbars';
import './codemirror/addon/simplescrollbars.css';

import './codemirror/mode/markdown.js';
import './codemirror/mode/python.js';
import { Notebook } from './Notebook';

/**
 * The abstract cell class that all other cell types inherit from. 
 * 
 * @remarks
 * This class is meant to be extended by Cell definitions from plugins, including builtin plugins. 
 * It contains all properties and functions that the library expects to be part of each cell.
 */
abstract class Cell {
    /**
     * Reference to the notebook instance that this cell is part of.
     */
    notebook: Notebook;
    /**
     * The HTMLElement to render under.
     */
    container: HTMLElement;
    /**
     * The content of the cell.
     * @internal
     */
    private _content: string;

    /**
     * The type of this cell.
     * @internal
     */
    private readonly _type: string;
    /**
     * The readonly type of this cell.
     * @remarks
     * This can only be set during cell initialization.
     */
    get type(): string {
        return this._type;
    }

    /**
     * Getter for the content of this cell. If this cell has an editor attached to it, it will get the content of the editor instead.
     * @returns String containing the content of this cell.
     */
    get content(): string {
        if (this.editor === undefined) {
            return this._content;
        }
        return this.editor.getValue();
    }
    /**
     * Setter for the content of this cell. If this cell has an editor attached to it, it will set the content of the editor instead.
     */
    set content(value: string) {
        if (this.editor === undefined) {
            this._content=value;
        }
        this.editor.setValue(value);
    }

    /**
     * A Reference to the [[CodeMirror.Editor]] instance that is attached to this cell.
     */
    editor: CodeMirror.Editor;
    /**
     * Reference to the Wrapper element for this cell's output.
     */
    outputWrapper: HTMLElement;
    /**
     * Reference to the Wrapper element for this cell's input.
     */
    inputWrapper: HTMLElement;

    /**
     * Constructor for any member inheriting from cell. Sets up the container and renders the cell to it.
     * @param notebook The notebook reference that this cell is attached to.
     * @param container The container of this cell.
     * @param type The type of this cell.
     * @param content The initial content of this cell.
     */
    constructor(notebook: Notebook, container: HTMLElement, type: string, content: string) {
        this.notebook = notebook;
        this.container = container;
        this.container.classList.add("cell");
        this.container.onclick = () => {
            this.notebook.setActiveCell(this);
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

    /**
     * Run this cell. Must be implemented by subclasses.
     */
    abstract runCell(): void;

    /**
     * Renders this cell as an editor with content inside input and output wrappers.
     */
    renderCell(): void {
        render(this.container, html`
        <div class = "cell-input">
            <textarea id="cm-textarea">${this.content}</textarea>
        </div>
        <div class = "cell-output"></div>
        `);
    }

    /**
     * Sets the visibility of the input wrapper.
     * 
     * @param visible The visibility of the input wrapper, defaulting to false.
     */
    setInputDisplay(visible = false): void {
        if (visible) {
            this.inputWrapper.style.display = 'block';
        } else {
            this.inputWrapper.style.display = 'none';
        }
    }

    /**
     * Creates and returns a reference to a [[CodeMirror.Editor]] instance that this cell will use.
     * 
     * @remarks
     * This will create an instance from a `<textarea>` in this cell that has id `#cm-textarea`.
     * 
     * @param content The content of the codemirror instance.
     */
    initCodeMirror(content: string): CodeMirror.Editor {
        const editor = CodeMirror.fromTextArea(this.container.querySelector("#cm-textarea") as HTMLTextAreaElement, {
            mode: {
                name: this.type,
                version: 3,
                singleLineStringErrors: false,
                fencedCodeBlockDefaultMode: 'python'
            },
            extraKeys: {
                'Tab': (cm: CodeMirror.Editor) => {
                    const indentUnit = cm.getOption("indentUnit") as number;
                    const spaces = Array(indentUnit + 1).join(" ");
                    cm.replaceSelection(spaces);
                },
                'Shift-Enter': (cm: CodeMirror.Editor) => {
                    this.notebook.runCell(cm);
                    return;
                },
            },
            indentUnit: 4,
            theme: 'one-theme',
            scrollbarStyle: 'overlay',
            viewportMargin: Infinity,
            lineNumbers: true
        });
        editor.setValue(content);
        editor.refresh();
        return editor;
    }
    /**
     * The JSON representation of this cell.
     * 
     * @remarks
     * Will have JSON in the format of `{"type":this.type, "content":serializedContent}` where `serializedContent` is a string split by newline.
     */
    toJSON(): CellSerialized {
        const serializedContent: string[] = this.content.split("\n");
        return {
            type: this.type,
            content: serializedContent
        }
    }
}

/**
 * Statically keeps track of cell types from builtin and third-party plugins.
 */
class Cells {
    public static builtins: { [type: string]: new (notebook: Notebook, container: HTMLElement, type: string, content: string) => Cell } = {};
    public static plugins: { [type: string]: new (notebook: Notebook, container: HTMLElement, type: string, content: string) => Cell } = {};
}

export { Cells, Cell };

/**
 * Interface containing all attributes that will appear in a serialized representation of a cell.
 * 
 * @remarks This will discard many of the instance specific traits, and is meant for saving cells to JSON.
 */
export interface CellSerialized {
    type: string,
    content: string[]
}