import { initialize } from '../../../pyodide/pyodide.js';
import { PythonCell } from './pythonCell.js';
import { App } from '../../../App';
import { Notebook } from '../../../Notebook.js';

declare global {
    interface Window { languagePluginUrl: string; logger: any; pyodide: any; }
}
class PyodideWrapper {
    notebook: Notebook;
    currentCell: PythonCell | null;
    runCount: number;
    initialized: boolean;

    constructor(notebook: Notebook) {
        this.notebook=notebook;
        window.languagePluginUrl = 'https://pyodide-cdn2.iodide.io/v0.15.0/full/'
        //Will Capture print() statements from python
        window.logger = new Object();
        window.logger.print = (message: string) => {
            this.notebook.pyodideWrapper.renderOutput(message);
        }
        this.initialized = false;
        this.currentCell = null;
        this.runCount = 0;
    }
    runPython(cell: PythonCell): void {
        if (!this.initialized) {
            initialize().then(() => {
                window.pyodide.runPython(
                    'from js import logger\n' +
                    'class stdWrapper():\n' +
                    '    def __init__(self, stream):\n' +
                    '        self.stream = stream\n' +
                    '    def write(self,text):\n' +
                    '        logger.print(text)\n' +
                    '        #self.stream.write(text)\n' +
                    'sys.stdout = stdWrapper(sys.__stdout__)\n' +
                    'sys.stderr = stdWrapper(sys.__stderr__)\n');
                this.runCount++;
                this.currentCell = cell;
                this.currentCell.setStatus("input", this.runCount);
                this.currentCell.resetOutput();
                try {
                    this.renderOutput(window.pyodide.runPython(this.currentCell.content));
                } catch (err) {
                    this.renderOutput(err);
                }
            });
            this.initialized = true;
            return;
        }
        this.runCount++;
        this.currentCell = cell;
        this.currentCell.setStatus("input", this.runCount);
        this.currentCell.resetOutput();
        try {
            this.renderOutput(window.pyodide.runPython(this.currentCell.content));
        } catch (err) {
            this.renderOutput(err);
        }
    }
    renderOutput(output: string): void {
        const formatted: string = this.formatOutput(output);
        this.currentCell?.appendToOutput(formatted);
        this.currentCell?.setStatus("output", this.runCount);
    }
    formatOutput(output: string): string {
        if (typeof output == "undefined") {
            return "";
        }
        output = output.toString();
        return output
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace("\n", "<br>");
    }
}
export { PyodideWrapper };