import { Cells } from "../../../Cells";
import { IPlugin, Plugin } from "../../Plugin";
import { PythonCell } from "./pythonCell";

@Plugin
/**
 * Builtin Python Cell Plugin.
 */
class Python implements IPlugin {
    constructor() {
        Cells.builtins["python"] = PythonCell;
    }
}

export { Python }