import { Cells, Cell } from './Cells';
import { PluginLoader } from './plugins/Plugin';
import { PyodideWrapper } from './plugins/builtin/Python/pyodideWrapper';

import './plugins/builtin/Python/Python';
import './plugins/builtin/Markdown/Markdown';

/**
 * Entrypoint into the INSCI-notebook library. Manages cells, loads plugins, and handles plugin events.
 * 
 * @remarks
 * The notebook can be instantiated using any [[HTMLElement]] as a container.
 */
class Notebook {
    /** Reference to Plugin Loader. @internal */
    private pl: PluginLoader;
    /** A list of [[Cell | Cells]] that this notebook contains. */
    cells: Cell[];
    /** The current selected [[Cell]]. */
    activeCell: Cell | null;
    /** Reference to Pyodide. @internal */
    pyodideWrapper: PyodideWrapper;
    /** The HTMLElement that this notebook instance uses as a container. */
    container: HTMLElement;
    /**
     * @param container Container that this notebook instance will instantiate under.
     */
    constructor(container: HTMLElement) {
        this.pl = new PluginLoader();
        this.pl.sendPluginEvent('preNotebookInit');
        this.cells = [];
        this.activeCell = null;
        this.pyodideWrapper = new PyodideWrapper(this);
        this.container = container;
        this.pl.sendPluginEvent('postNotebookInit');
    }

    /**
     * Creates a `<div>` that a cell will use as a container.
     * @returns Reference to created container.
     */
    createCellContainer(): HTMLElement {
        const cellContainer: HTMLElement = document.createElement("div");
        this.container.appendChild(cellContainer);
        return cellContainer;
    }

    /**
     * Creates a cell from a saved JSON snippet.
     * 
     * @remarks
     * Valid JSON serialization consists of `{"type":"...", "content":"..."}`
     * 
     * @param cell JSON serialization of a cell.
     */
    //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    createCell(cell: any): void {
        const cellType: string = cell["type"];
        const cellContent: string = cell["content"].join("\n");
        const cellContainer: HTMLElement = this.createCellContainer();
        this.cells.push(this.initializeFromType(cellContainer, cellType, cellContent));
    }
    /**
     * Creates a new cell, if `cell` is defined, it copies content and position from another cell and replaces it.
     * @param type The type of cell as registered by Plugins.
     * @param cell A Cell to replace. *Optional.*
     */
    newCell(type: string, cell?: Cell | null): void {
        if (cell != undefined || cell != null) {
            const c: Cell = this.initializeFromType(cell.container, type, cell.content);
            this.cells[this.cells.indexOf(cell)] = c;
        } else {
            const cellContainer: HTMLElement = this.createCellContainer();
            const c: Cell = new Cells.builtins["python"](this, cellContainer, "python", "");
            this.cells.push(c);
        }
    }
    /**
     * Delete a cell from the notebook.
     * @param cell The cell to delete.
     */
    deleteCell(cell: Cell | null): void {
        if (cell == null)
            return;
        const idx = this.cells.indexOf(cell);
        if (idx > -1) {
            this.container.removeChild(cell.container);
            this.cells.splice(idx, 1);
        }
    }

    /**
     * Creates a cell from a given type.
     * @param cellContainer The container to nest the cell under.
     * @param cellType The type of cell to instantiate.
     * @param cellContent The content of this cell.
     * 
     * @returns Reference to the cell that was created.
     */
    initializeFromType(cellContainer: HTMLElement, cellType: string, cellContent: string): Cell {
        return new Cells.builtins[cellType](this, cellContainer, cellType, cellContent);
    }

    /**
     * Run a cell given the reference to its object or CodeMirror instance.
     * 
     * @remarks
     * Given a CodeMirror instance, this will search the list of cells in the notebook for a cell matching that Cell. If none is found, then this fucntion will do nothing.
     * 
     * @param c A reference to the cell, either by its Cell object, or its CodeMirror instance.
     */
    runCell(c: CodeMirror.Editor | Cell): void {
        if (c instanceof Cell) {
            c.runCell();
            return;
        }
        this.cells.forEach(cell => {
            if (cell.editor == c) {
                cell.runCell();
                return;
            }
        });
    }

    /**
     * Select a cell, changing the current active cell reference to the specified cell.
     * 
     * @remarks
     * This will add the css class `.cell-selected`, and fire the plugin event `onSelectCell`.
     * 
     * @param cell Reference to a cell that will be set selected
     */
    setActiveCell(cell: Cell): void {
        if (this.activeCell != null) {
            this.activeCell.container.classList.remove('cell-selected');
        }
        this.activeCell = cell;
        this.activeCell.container.classList.add('cell-selected');
        this.pl.sendPluginEvent("onSelectCell", cell);
    }

    /**
     * Serialize a notebook's cells and metadata.
     * 
     * @returns JSON representation for a function like `JSON.stringify`.
     */
    toJSON(): NotebookSerialized {
        return {
            cells: this.cells
        }
    }
    /**
     * Renders the notebook, making any changes to the ordering of the cells.
     */
    render(): void {
        this.cells.forEach((cell) => {
            this.container.appendChild(cell.container);
        });
    }
}


export { Notebook };
/**
 * Interface containing all attributes that will appear in a serialized representation of the Notebook.
 * 
 * @remarks This will discard many of the instance specific traits, and is meant for saving notebooks to JSON.
 */
export interface NotebookSerialized {
    cells: Cell[];
}