import { Cell } from "./cells/cell";
import { MarkdownCell } from "./plugins/builtin/markdownCell";
import { PythonCell } from "./plugins/builtin/pythonCell";

class Cells {
    public static readonly builtins: { [type: string]: new (container: HTMLElement, type: string, content: string) => Cell } = {
        markdown: MarkdownCell,
        python: PythonCell,
    };
    public static plugins: { [type: string]: new (container: HTMLElement, type: string, content: string) => Cell } = {};
}

export { Cells };