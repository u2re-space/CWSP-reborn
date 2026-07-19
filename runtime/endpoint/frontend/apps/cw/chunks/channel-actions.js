//#region ../../modules/projects/subsystem/src/routing/api/channel-actions.ts
/**
* Canonical channel action strings for {@link ChannelInvokableView.invokeChannelApi}.
* Align with UnifiedMessaging `type` / share-target flows where possible.
*/
/** Markdown / binary hand-off into Work Center or from Viewer. */
var FileAttachmentApiAction = {
	ViewerPushToWorkcenter: "viewer.attach-to-workcenter",
	WorkcenterAttach: "attach-files",
	WorkcenterFileAttach: "file-attach",
	WorkcenterShare: "content-share"
};
/** Home / speed-dial / wallpaper (StateStorage; helpers in `shared/routing/workspace-files-api`). */
var FileWorkspaceUseAction = {
	WallpaperSet: "workspace.wallpaper-set",
	WallpaperFromFile: "workspace.wallpaper-from-file",
	SpeedDialPinHref: "workspace.speed-dial-pin-href",
	SpeedDialPinFile: "workspace.speed-dial-pin-file"
};
/** explorer + FL-UI `ui-file-manager` wiring */
var ExplorerChannelAction = {
	NavigatePath: "navigate-path",
	ContentExplorer: "content-explorer",
	Navigate: "navigate",
	GetPath: "get-path",
	/** Payload: `{ file: File, path?: string }` — OPFS save via operative. */
	FileSave: "file-save",
	RequestUpload: "explorer-request-upload",
	RequestPaste: "explorer-request-paste",
	RequestUse: "explorer-request-use",
	/** Payload: `"light"` | `"dark"` | `"system"` or `{ colorScheme }`. */
	SetColorScheme: "explorer-set-color-scheme"
};
var ViewerChannelAction = {
	ContentView: "content-view",
	ContentLoad: "content-load",
	SetContent: "set-content",
	OpenUrl: "open-url",
	OpenMarkdownUrl: "open-markdown-url",
	AttachToWorkcenter: FileAttachmentApiAction.ViewerPushToWorkcenter,
	/** Payload: `"light"` | `"dark"` | `"system"` or `{ colorScheme }` — matches explorer channel shape. */
	SetColorScheme: "viewer-set-color-scheme"
};
var SettingsChannelAction = {
	Patch: "patch",
	SettingsUpdate: "settings-update"
};
var AirpadChannelAction = {
	Start: "start",
	AirpadStart: "airpad-start",
	Retry: "retry"
};
var HomeChannelAction = {
	Navigate: "navigate",
	OpenView: "open-view",
	...FileWorkspaceUseAction
};
var HistoryChannelAction = {
	Reload: "reload",
	Refresh: "refresh"
};
//#endregion
export { SettingsChannelAction as a, HomeChannelAction as i, ExplorerChannelAction as n, ViewerChannelAction as o, HistoryChannelAction as r, AirpadChannelAction as t };
