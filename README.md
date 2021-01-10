# INSCI  
The \[In\]teractive \[S\]cientific \[C\]omputing \[I\]nterface  

---
INSCI is an extremely lightweight jupyter notebook-like environment that lives solely in the browser. While Jupyter Notebooks require a python backend to be running on the host computer, INSCI is self-contained, and can be deployed on any site as a static set of files. INSCI is developed using Typescript and styled using LESS. INSCI doesn't depend on any large and/or slow libraries or frameworks, and achieves it's light weight by depending upon only a few smaller libraries:
* [pyodide](https://github.com/iodide-project/pyodide) - Python interpretor compiled to WebAssembly.
* [µhtml](https://github.com/WebReflection/uhtml) - Lightweight html rendering framework.
* [KaTeX](https://github.com/KaTeX/KaTeX) - Fast LaTeX to HTML library.
* [marked](https://github.com/markedjs/marked) - Small markdown to HTML library.

## Installation
You can clone and run INSCI on your own machine!
```bash
git clone https://github.com/AmitPr/insci
cd insci && npm i
npm run pack
```

## Usage
INSCI is currently in heavy development, and as such, can only be run by opening the `index.html` file in the distribution folder.

## Work-in-progress Features and Goals
* Adapt Pyodide Loader to run smoothly.
* Javascript and/or Typescript Cells.
* Workflows for loading and saving notebooks as JSON.
* Conversion between Jupyter and INSCI notebooks.
* Plugin system for developers.
* Minimize size impact of CodeMirror

## Credits
Aside from the libraries mentioned earlier, various other packages are used to bundle INSCI. Credit goes to all authors and contributors of these packages.
INSCI itself is developed and maintained by [Amit Prasad](https://github.com/AmitPr/insci).