import './pyodide/pyodide.js';
import CodeMirror from 'codemirror';

declare global {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Window { languagePluginUrl: string; logger: any; pyodide: any; }
}
class PyodideWrapper {

    constructor() {
        window.languagePluginUrl = 'https://pyodide-cdn2.iodide.io/v0.15.0/full/'
        //Will Capture print() statements from python
        window.logger = new Object();
        window.logger.print = function (message: string) {
            window.pyodide.renderOutput(message);
        }
        languagePluginLoader.then(() => {
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

        });
    }
    runPython(cm: CodeMirror.Editor): void {
        const currentCell: HTMLElement = cm.getWrapperElement().closest(".Cell") as HTMLElement;
        this.resetOutput(currentCell);
        try {
            this.renderOutput(window.pyodide.runPython(cm.getValue()), currentCell);
        } catch (err) {
            this.renderOutput(err, currentCell);
        }
    }
    renderOutput(output: string, currentCell: HTMLElement): void {
        const formatted = this.formatOutput(output);
        const outputArea: HTMLElement = currentCell.querySelector('.jp-OutputArea-output pre') as HTMLElement;
        outputArea.innerHTML += formatted;
    }
    resetOutput(currentCell: HTMLElement): void {
        const out: HTMLElement | null = currentCell.querySelector('.jp-OutputArea-output pre');
        if (out) {
            out.innerHTML = "";
        } else {
            const container = document.createElement("div");
            container.classList.add("Cell-output");
            currentCell.appendChild(container);
            currentCell.innerHTML += '<div class="Cell-output"><div class="jp-RenderedText jp-OutputArea-output" data-mime-type="text/plain"><pre></pre></div></div>';
        }
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