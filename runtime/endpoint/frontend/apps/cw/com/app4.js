import { i as H } from "./app.js";
import { B as defineElement, V as property, z as GLitElement } from "./app2.js";
import { i as ensureStyleSheet } from "../fest/icon.js";
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/decorate.js
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/base/UIElement.ts
var UIElement = class UIElement extends GLitElement() {
	theme = "default";
	render = function() {
		return H`<slot></slot>`;
	};
	constructor() {
		super();
	}
	onRender() {
		return super.onRender();
	}
	connectedCallback() {
		return super.connectedCallback?.() ?? this;
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		self.loadStyleLibrary(ensureStyleSheet());
		return self;
	}
};
__decorate([property({ source: "attr" })], UIElement.prototype, "theme", void 0);
UIElement = __decorate([defineElement("ui-element")], UIElement);
var UIElement_default = UIElement;
//#endregion
export { UIElement_default as n, __decorate as r, UIElement as t };
