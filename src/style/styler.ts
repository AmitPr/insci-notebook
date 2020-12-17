import { getCookie } from '../app/util/cookieManager';
const cookie: string = getCookie("theme");
let currentTheme: string;
if (cookie) {
    currentTheme = cookie;
} else {
    currentTheme = "light";
}
document.documentElement.setAttribute("data-theme", currentTheme);

function setTheme(theme: string): void {
    document.cookie = "theme=" + theme + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.documentElement.setAttribute("data-theme", theme);
    currentTheme = theme;
}
function toggleTheme(): void {
    if (currentTheme == "light") {
        setTheme("dark");
    } else {
        setTheme("light");
    }
}
export { setTheme, toggleTheme, currentTheme }