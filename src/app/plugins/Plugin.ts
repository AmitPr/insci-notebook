function Plugin<T extends new(...args: unknown[]) => any>(target: T): void {
    PluginLoader.plugins.push(target);
}

class PluginLoader {
    public static plugins: (new(...args: unknown[])=>any)[]=[];
    constructor(){
        for(const plugin of PluginLoader.plugins){
            new plugin();
        }
    }
}

export { Plugin, PluginLoader }
