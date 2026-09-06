//#region ../../modules/projects/fl.ui/src/styles/font-registry.ts
/**
* Font Registry
* FIND:font-registry
*
* WHY: Dynamic shards keep each CRX chunk under the 2048 kB minify warning.
* INVARIANT: do not statically import shard files from this barrel.
*/
var loadShard = (loader) => loader();
var loadFontRegistryShards = async () => {
	const parts = await Promise.all([
		loadShard(() => import("./app16.js")),
		loadShard(() => import("./app15.js")),
		loadShard(() => import("./app14.js")),
		loadShard(() => import("./app13.js")),
		loadShard(() => import("./app12.js"))
	]);
	return Object.assign({}, ...parts.map((part) => part.fontRegistry));
};
//#endregion
export { loadFontRegistryShards };
