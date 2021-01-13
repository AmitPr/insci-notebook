# INSCI-notebook  
The \[In\]teractive \[S\]cientific \[C\]omputing \[I\]nterface  
###### [Documentation](https://amitpr.github.io/insci-notebook/)
---
INSCI-notebook is the backbone of the [INSCI](https://github.com/AmitPr/insci) environment. You can use this library to completely customize the function of your own notebook environment as compared to the regular INSCI environment. For developers looking to get started writing INSCI notebooks directly, see the main INSCI repository for more on the project as a whole. INSCI-notebook is a pluggable library made using Typescript. INSCI-notebook doesn't depend on any large and/or slow libraries or frameworks, and achieves it's light weight by depending upon only a few smaller libraries:
* [pyodide](https://github.com/iodide-project/pyodide) - Python interpretor compiled to WebAssembly.
* [µhtml](https://github.com/WebReflection/uhtml) - Lightweight html rendering framework.
* [KaTeX](https://github.com/KaTeX/KaTeX) - Fast LaTeX to HTML library.
* [marked](https://github.com/markedjs/marked) - Small markdown to HTML library.
* [insci-codemirror](https://github.com/AmitPr/insci-codemirror) - Minified version of codemirror used for insci with slightly modified mode files.

## Installation
INSCI-notebook is available from npm:
```bash
npm install insci-notebook
```

## API
INSCI-notebook implements a plugin framework so that third-party developers can easily add to the features of the library. Plugins are defined using the experimental decorator feature in typescript, which can be enabled by setting `"experimentalDecorators":true`. Here's an example plugin/App scenario:  
```typescript
/* ExamplePlugin.ts */
import {Cell, Plugin, IPlugin} from 'insci-notebook';
/*
 * We can optionally implement the IPlugin so that an IDE's intellisense 
 * could show methods that can be overriden. This is optional.
 */
@Plugin
class ExamplePlugin implements IPlugin{
    constructor(){
        console.log("Plugin Initialized");
    }
    onSelectCell(cell: Cell): void{
        console.log("Cell with type " + cell.type + " selected!");
    }
}
/* App.ts */
import 'ExamplePlugin.ts';
import {Notebook} from 'insci-notebook';
class App{
    constructor(){
        const nb: Notebook = new Notebook(document.querySelector("#nb-container") as HTMLElement);
        // ExamplePlugin is loaded when the notebook initializes.
    }
}
``` 
Of course, here we're assuming that an App instance is created somewhere else, for example an `index.ts` or some other entrypoint. The full plugin API is in the documentation.

## Work-in-progress Features and Goals
* Adapt Pyodide to load smoothly.
* Javascript and/or Typescript Cells.
* Loading and saving notebooks as JSON (or some other format).
* Conversion between Jupyter and INSCI notebooks.

## Credits
INSCI-notebook itself is developed and maintained by [Amit Prasad](https://github.com/AmitPr/). See the [main INSCI repository](https://github.com/AmitPr/insci) to see how the library is implemented in it's primary usecase.
