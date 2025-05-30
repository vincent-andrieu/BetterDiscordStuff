import { DOM, ReactUtils } from "betterdiscord";
import { SettingsManager, StringsManager } from "@lib";
import locales from "../locales.json";

export const Settings = new SettingsManager({
	everyone: true,
	here: true,
	showRoleIcons: true,
});

export const Strings = new StringsManager(locales, "en-US");

export const peopleSVG = DOM.parseHTML(
	'<svg class="role-mention-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="14" width="14"><path d="M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z" fill="currentColor" /><path d="M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z" fill="currentColor" /><path d="M20.0001 20.006H22.0001V19.006C22.0001 16.4433 20.2697 14.4415 17.5213 13.5352C19.0621 14.9127 20.0001 16.8059 20.0001 19.006V20.006Z" fill="currentColor" /><path d="M14.8834 11.9077C16.6657 11.5044 18.0001 9.9077 18.0001 8.00598C18.0001 5.96916 16.4693 4.28218 14.4971 4.0367C15.4322 5.09511 16.0001 6.48524 16.0001 8.00598C16.0001 9.44888 15.4889 10.7742 14.6378 11.8102C14.7203 11.8418 14.8022 11.8743 14.8834 11.9077Z" fill="currentColor" /></svg>'
) as HTMLElement;

export const getIconElement = (roleId: string, roleIcon: string) => {
	const icon = document.createElement("img");
	icon.className = "role-mention-icon";
	icon.setAttribute("style", "border-radius: 3px; object-fit: contain;");
	icon.width = icon.height = 16;
	icon.src = `https://cdn.discordapp.com/role-icons/${roleId}/${roleIcon}.webp?size=24&quality=lossless`;
	return icon;
};

// @ts-ignore
// From https://github.com/rauenzi/BetterDiscordAddons/blob/692abbd1877ff6d837dc8a606767d019e52ebe23/Plugins/RoleMembers/RoleMembers.plugin.js#L60-L61
const from = (arr) => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({ [k]: v })));
export const filter = (obj: any, predicate: any) =>
	from(
		Object.entries(obj).filter((o) => {
			return predicate(o[1]);
		})
	);

export const getProps = (el: HTMLElement, filter: (x: any) => boolean) => {
	const reactInstance = ReactUtils.getInternalInstance(el);
	let current = reactInstance?.return;
	while (current) {
		if (current.pendingProps && filter(current.pendingProps)) return current.pendingProps;
		current = current.return;
	}
	return null;
};
