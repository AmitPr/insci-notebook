import { Cells } from "../../../Cells";
import { IPlugin, Plugin } from "../../Plugin";
import { PythonCell } from "./pythonCell";

@Plugin
class Python implements IPlugin {
    constructor() {
        Cells.builtins["python"] = PythonCell;
    }
}

export { Python }