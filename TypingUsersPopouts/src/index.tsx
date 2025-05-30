import { DOM, Patcher, Utils, Meta, Plugin, Changes } from "betterdiscord";
import { showChangelog } from "@lib";
import { changelog } from "./manifest.json";
import { typingSelector, TypingUsersContainer } from "./modules";
import { RelationshipStore, UserStore } from "@discord/stores";
import { Popout, UserPopout } from "@discord/components";
import { loadProfile } from "@discord/modules";

const nameSelector = `${typingSelector} strong`;

export default class TypingUsersPopouts implements Plugin {
	meta: Meta;

	constructor(meta: Meta) {
		this.meta = meta;
	}

	start() {
		showChangelog(changelog as Changes[], this.meta);
		DOM.addStyle(`${nameSelector} { cursor: pointer; } ${nameSelector}:hover { text-decoration: underline; }`);
		this.patch();
	}

	patch() {
		if (!TypingUsersContainer) return;

		const patchType = (props: any, ret: any) => {
			const text = Utils.findInTree(ret, (e) => e.children?.length && e.children[0]?.type === "strong", {
				walkable: ["props", "children"],
			});
			if (!text) return;

			const typingUsersIds = Object.keys(props.typingUsers).filter(
				(id) => id !== UserStore.getCurrentUser().id && !RelationshipStore.isBlocked(id)
			);
			const channel = props.channel;
			const guildId = channel.guild_id;

			let i = 0;
			text.children = text.children.map((e: React.ReactElement) => {
				if (e.type !== "strong") return e;

				const user = UserStore.getUser(typingUsersIds[i++]);

				return (
					<Popout
						align="left"
						position="top"
						key={user.id}
						renderPopout={(props: any) => (
							<UserPopout
								{...props}
								user={user}
								currentUser={UserStore.getCurrentUser()}
								guildId={guildId}
								channelId={channel.id}
							/>
						)}
						preload={() =>
							loadProfile?.(user.id, user.getAvatarURL(guildId, 80), { guildId, channelId: channel.id })
						}
					>
						{(props: any) => <strong {...props} {...e.props} />}
					</Popout>
				);
			});
		};

		let patchedType: ((props: any) => React.ReactNode) | undefined;

		Patcher.after(...TypingUsersContainer, (_, __, containerRet) => {
			if (patchedType) {
				containerRet.type = patchedType;
				return containerRet;
			}

			const original = containerRet.type as React.FunctionComponent<any>;

			patchedType = (props) => {
				const ret = original(props);
				patchType(props, ret);
				return ret;
			};

			containerRet.type = patchedType;
		});
	}

	stop() {
		DOM.removeStyle();
		Patcher.unpatchAll();
	}
}
