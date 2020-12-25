class Button {
    container: HTMLElement;
    icon: string;
    callback: any;
    //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(container: HTMLElement, icon: string, callback: any) {
        this.container = container;
        var iconContainer: HTMLElement | null;
        if (iconContainer = this.container.querySelector(".icon")) {
            iconContainer.innerHTML = icon;
        } else {
            this.container.innerHTML = icon + this.container.innerHTML;
        }
        this.icon = icon;
        this.callback = callback;
        this.container.onclick = callback;
    }
}
export { Button }