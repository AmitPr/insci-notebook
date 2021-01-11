import { Cell } from "../Cells";
interface IPlugin {
    new(...args: unknown[]): any;
    preNotebookInit?(): void;
    postNotebookInit?(): void;
    onSelectCell?(cell: Cell): void;
}

function Plugin<T extends IPlugin>(target: T): void {
    PluginLoader.plugins.push(target);
}

class PluginLoader {
    public static plugins: IPlugin[] = [];
    private pl_list: IPlugin[] = []
    constructor() {
        for (const plugin of PluginLoader.plugins) {
            this.pl_list.push(new plugin());
        }
    }
    sendPluginEvent(e: keyof IPlugin, ...args: any[]): void {
        for (const plugin of this.pl_list) {
            if (e in plugin) {
                if(typeof plugin[e]==='function'){
                    //@ts-expect-error Attempts to call the function specified with the arguments given, which causes the compiler to complain about types.
                    plugin[e](...args);
                }
            }
        }
    }
}

export { Plugin, IPlugin, PluginLoader }
