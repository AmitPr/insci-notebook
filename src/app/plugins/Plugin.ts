function Plugin<T extends new(...args: {}[]) => any>(target: T) {
    PluginLoader.plugins.push(target);
}

class PluginLoader {
    public static plugins: (new(...args: {}[])=>any)[]=[];
    constructor(){
        for(let plugin of PluginLoader.plugins){
            new plugin();
        }
    }
}

export { Plugin, PluginLoader }
