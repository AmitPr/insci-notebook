class PyodideWrapper {
    constructor() {
        window.languagePluginUrl = 'https://pyodide-cdn2.iodide.io/v0.15.0/full/'
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
        this.currentCell = cm.getTextArea().closest(".Cell");
        this.resetOutput();
        try {
            this.renderOutput(pyodide.runPython(cm.getValue()));
        }catch(err){
            this.renderOutput(err);
        }
    }
    renderOutput(output) {
        var formatted = this.formatOutput(output);
        this.currentCell.querySelector('.jp-OutputArea-output pre').innerHTML += formatted;
    }
    resetOutput() {
        var out = this.currentCell.querySelector('.jp-OutputArea-output pre');
        if(out){
            out.innerHTML = "";
        }else{
            var container = document.createElement("div");
            container.classList.add("Cell-output");
            this.currentCell.appendChild(container);
            this.currentCell.innerHTML+='<div class="Cell-output"><div class="jp-RenderedText jp-OutputArea-output" data-mime-type="text/plain"><pre></pre></div></div>';
        }
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
export {PyodideWrapper};