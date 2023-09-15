import type { ServerLoad } from "@sveltejs/kit";
import { getThemeProperties } from "@skeletonlabs/tw-plugin";

function convertColorToRgbString(themeColor: string) {
    return `rgb(${themeColor.replaceAll(" ", ",")})`;
}

// Getting theme properties only works server-side and not in browser
// Properties are needed for graph coloring
export const load: ServerLoad = () => {
    const themeProperties = getThemeProperties("skeleton");

    const primary = convertColorToRgbString(themeProperties["--color-primary-500"]);
    const secondary = convertColorToRgbString(themeProperties["--color-secondary-500"]);
    const tertiary = convertColorToRgbString(themeProperties["--color-tertiary-500"]);
    return { colors: { primary, secondary, tertiary } };
};
