window.languagePluginUrl = 'https://pyodide-cdn2.iodide.io/v0.15.0/full/'

class PyodideWrapper {
    constructor() {
        //Will Capture print() statements from python
        window.logger = new Object();
        window.logger.print = function (message) {
            cellManager.pyodide.renderOutput(message);
        }
        languagePluginLoader.then(() => {
            pyodide.runPython(
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
    runPython(cm) {
        this.currentCell = cm.getTextArea().closest(".jp-Cell");
        this.resetOutput();
        try {
            this.renderOutput(pyodide.runPython(cm.getValue()));
        }catch(err){
            this.renderOutput(err);
        }
    }
    renderOutput(output) {
        var formatted = this.formatOutput(output);
        this.currentCell.querySelector('.jp-OutputArea-output').innerHTML += formatted;
    }
    resetOutput() {
        this.currentCell.querySelector('.jp-OutputArea-output').innerHTML = "";
    }
    formatOutput(output) {
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