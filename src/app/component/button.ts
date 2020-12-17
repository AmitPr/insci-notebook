class Button {
    container: HTMLElement;
    icon: string;
    callback: any;
    //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(container: HTMLElement, icon: string, callback: any) {
        this.container = container;
        this.container.innerHTML = icon;
        this.icon = icon;
        this.callback = callback;
        this.container.onclick = callback;
    }
}
export { Button }