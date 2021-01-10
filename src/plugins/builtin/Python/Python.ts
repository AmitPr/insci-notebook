import { Cells } from "../../../Cells";
import { Plugin } from "../../Plugin";
import { PythonCell } from "./pythonCell";

@Plugin
class Python {
    constructor() {
        Cells.builtins["python"] = PythonCell;
    }
}

export { Python }