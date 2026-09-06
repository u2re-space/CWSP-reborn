import { r as __exportAll } from "./rolldown-runtime.js";
import { f as viewBroadcastChannelName, n as BROADCAST_CHANNELS } from "./Names.js";
//#region src/shared/routing/channel/workcenter-command-wire.ts
var workcenter_command_wire_exports = /* @__PURE__ */ __exportAll({
	WORKCENTER_COMMAND_TYPE: () => WORKCENTER_COMMAND_TYPE,
	postWorkCenterCommand: () => postWorkCenterCommand
});
var WORKCENTER_COMMAND_TYPE = "workcenter-command";
var postWorkCenterCommand = (command) => {
	const envelope = {
		type: WORKCENTER_COMMAND_TYPE,
		command
	};
	const names = [BROADCAST_CHANNELS.WORK_CENTER, viewBroadcastChannelName("workcenter")];
	for (const name of names) try {
		const channel = new BroadcastChannel(name);
		channel.postMessage(envelope);
		channel.close();
	} catch {}
};
//#endregion
export { workcenter_command_wire_exports as n, postWorkCenterCommand as t };
