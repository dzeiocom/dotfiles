import { Presets, MultiBar } from "cli-progress";

export default class Statics {

	private static _multibar: MultiBar

	public static set multibar(bar: MultiBar) {
		this._multibar = bar
	}

	public static get multibar() {
		if (!this._multibar) this._multibar = new MultiBar({
			format: `{obj}: {percentage}% (${'{bar}'.cyan}) {action}: {el}`,
			clearOnComplete: false,
			hideCursor: true,
			synchronousUpdate: false
		}, Presets.shades_classic)
		return this._multibar
	}
}
