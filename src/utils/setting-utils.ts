import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number, save = true): void {
	if (save) {
		localStorage.setItem("hue", String(hue));
	}
	document.documentElement.style.setProperty("--hue", String(hue));
}

export function getBgBlur(): number {
	const stored = localStorage.getItem("bg-blur");
	return stored ? Number.parseInt(stored, 10) : 4; // Default blur is 4
}

export function setBgBlur(blur: number): void {
	localStorage.setItem("bg-blur", String(blur));
	document.documentElement.style.setProperty("--bg-blur", `${blur}px`);
}

export function getHideBg(): boolean {
	const stored = localStorage.getItem("hide-bg");
	return stored === "true";
}

// 优化：通过 class 控制显示隐藏，配合 Layout 中的 CSS 防止闪烁
export function setHideBg(hide: boolean): void {
	localStorage.setItem("hide-bg", String(hide));
	if (hide) {
		document.documentElement.classList.add("hide-bg");
	} else {
		document.documentElement.classList.remove("hide-bg");
	}
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}
	if (expressiveCodeConfig?.theme) {
		document.documentElement.setAttribute(
			"data-theme",
			expressiveCodeConfig.theme,
		);
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
