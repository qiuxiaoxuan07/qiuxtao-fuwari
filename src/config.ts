import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "秋晓桃の神秘小窝",
	subtitle: "",
	lang: "zh_CN",
	themeColor: {
		hue: 360,
		fixed: false,
	},
	banner: {
		enable: false,
		src: "",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	background: {
		enable: true,
		src: "https://qiuxiaotao.cn/background.jpg",
		position: "center",
		size: "cover",
		repeat: "no-repeat",
		attachment: "fixed",
		opacity: 1,
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [
		{
			src: "https://qiuxiaotao.cn/favicon.ico",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "会议",
			url: "/meeting/", // 对应刚才创建的 src/pages/meeting.astro
			external: false, // 设为 false 表示站内链接
		},
		{
			name: "工具",
			url: "javascript:void(0);",
			external: false,
			children: [
				{
					name: "在线秒表",
					url: "/stopwatch/",
					external: false,
				},
			],
		},
		LinkPreset.Friends,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://qiuxiaotao.cn/avatar.jpg",
	name: "秋晓桃",
	bio: "嗨，别来无恙啊！",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/qiuxtao",
		},
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/1059155193",
		},
		{
			name: "网易云音乐",
			icon: "simple-icons:neteasecloudmusic",
			url: "https://music.163.com/#/user/home?id=12113599513",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/id/qiuxtao/",
		},
		{
			name: "QQ",
			icon: "fa6-brands:qq",
			url: "https://qm.qq.com/q/XvN6jngtSC",
			mobileUrl:
				"mqqapi://card/show_pslcard?src_type=internal&version=1&uin=1021865556&card_type=person&source=sharecard",
		},
		{
			name: "Telegram",
			icon: "fa6-brands:telegram",
			url: "https://t.me/qiuxtao",
		},
		{
			name: "Email",
			icon: "fa6-solid:envelope",
			url: "mailto:nya@qiuxiaotao.com",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
