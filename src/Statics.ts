import { getUserHome } from "./Functions";

export default class Statics {

	public static get folder(): string {
		return `${getUserHome()}/.config/dzeio-dotfiles`
	}
}
