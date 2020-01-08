import SimpleModule from "../SimpleModule";
import { getUserHome } from "../Functions";
import FileInterface from "../FileInterface";

export default class Fish extends SimpleModule {
	files: FileInterface[] = [
		{
			displayName: "Functions",
			filename: "functions",
			path: `${getUserHome()}/.config/fish/functions`
		}
	]
	moduleName = "Fish"
}
