import { Cell } from "../Cells";
/**
 * An interface describing all the valid events and methods that plugins may override.
 * 
 * @remarks
 * While plugins may find it useful to implement this interface, it is not required, and the library will be able to call these methods as long as they are defined with name and parameters equal to the ones shown here.
 */
interface IPlugin {
    /**
     * Called when the Notebook is initialized, before any other actions are taken, but after all plugins have been initialized.
     */
    preNotebookInit?(): void;
    /**
     * Called after the Notebook has completed initialization.
     */
    postNotebookInit?(): void;
    /**
     * Called when a different cell is selected.
     * @param cell The cell that was just selected.
     */
    onSelectCell?(cell: Cell): void;
}
/**
 * Internal extension to [[IPlugin]] that allows it to be used to store instantiable references to plugins.
 * @internal
 */
interface IPluginInternal extends IPlugin {
    new(...args: unknown[]): any;
}
/**
 * Function used by TypeScript when the `@Plugin` annotation is used. Adds the plugin to the [[PluginLoader]]'s list of plugins that will be loaded on notebook initialize.
 * @param target Class which this decorator applies to
 */
function Plugin<T extends IPluginInternal>(target: T): void {
    PluginLoader.plugins.push(target);
}

/**
 * Loads Plugins from a statically defined list of plugins that is built using the `@Plugin` annotation.
 */
class PluginLoader {
    /**
     * A List of plugins that will be instantiated when plugins are loaded.
     */
    public static plugins: IPlugin[] = [];
    /**
     * An private list of the currently instantiated plugins.
     * @internal
     */
    private pl_list: IPlugin[] = []
    /**
     * Loads all the plugins defined in the `plugins` array.
     */
    constructor() {
        for (const plugin of PluginLoader.plugins) {
            this.pl_list.push(new (plugin as IPluginInternal)());
        }
    }
    /**
     * Sends a plugin event to all initialized plugins, calling the method defined in the `event` parameter if it exists.
     * 
     * @remarks
     * If the `...args` array contains too many or too few arguments, or arguments of the wrong type, it will NOT generate a compiler error, only a runtime error.
     * This function makes use of a black-magic `plugin[event](..args)` call which has been made valid using `@ts-expect-error`. Be wary of using it outside internal contexts.
     * 
     * @param event The name of the event to send
     * @param args Optional arguments that the event method accepts
     * @internal
     */
    sendPluginEvent(event: keyof IPlugin, ...args: any[]): void {
        for (const plugin of this.pl_list) {
            if (event in plugin) {
                if (typeof plugin[event] === 'function') {
                    //@ts-expect-error Attempts to call the function specified with the arguments given, which causes the compiler to complain about unknown types.
                    plugin[event](...args);
                }
            }
        }
    }
}

export { Plugin, IPlugin, PluginLoader }
