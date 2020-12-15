function getCookie(cname: string): string {
    const name: string = cname + "=";
    const decodedCookie: string = decodeURIComponent(document.cookie);
    const ca: string[] = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c: string = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname: string, cvalue: string): void {
    document.cookie = cname + "=" + cvalue + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}
export { getCookie, setCookie }