//#region src/shared/routing/native/launcher-bridge.ts
async function launcherIsDefault() {
	return false;
}
async function launcherRequestDefault() {
	return false;
}
async function launcherList(_query) {
	return [];
}
async function launcherLaunch(_pkg, _component) {
	return false;
}
async function launcherIcon(_cacheKey, _size = 64, _variant = "default", _pack = "", _drawable = "") {
	return "";
}
async function launcherIconVariants(_cacheKey) {
	return [];
}
async function launcherIconPacks() {
	return [];
}
async function launcherIconPackIcons(_pack, _query = "", _limit = 120) {
	return [];
}
async function launcherIconBlobUrl(_cacheKey, _size = 64, _variant = "default", _pack = "", _drawable = "") {
	return "";
}
//#endregion
export { launcherIcon, launcherIconBlobUrl, launcherIconPackIcons, launcherIconPacks, launcherIconVariants, launcherIsDefault, launcherLaunch, launcherList, launcherRequestDefault };
