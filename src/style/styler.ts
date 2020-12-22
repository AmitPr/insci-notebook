import { getCookie } from '../app/util/cookieManager';
const cookie: string = getCookie("theme");
let currentTheme: string;
if (cookie) {
    currentTheme = cookie;
} else {
    currentTheme = "light";
}
document.documentElement.classList.remove("dark","light");
document.documentElement.classList.add(currentTheme);

function setTheme(theme: string): void {
    document.cookie = "theme=" + theme + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.documentElement.classList.remove("dark","light");
    document.documentElement.classList.add(theme);
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