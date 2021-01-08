import { Cell } from "./cells/cell";
import { PythonCell } from "./plugins/builtin/pythonCell";

class Cells {
    public static builtins: { [type: string]: new (container: HTMLElement, type: string, content: string) => Cell } = {
        python: PythonCell,
    };
    public static plugins: { [type: string]: new (container: HTMLElement, type: string, content: string) => Cell } = {};
}

export { Cells };