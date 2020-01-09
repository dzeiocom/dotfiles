import SimpleModule from "../SimpleModule";
import { getUserHome } from "../Functions";
import FileInterface from "../interfaces/FileInterface";

export default class HyperJS extends SimpleModule {
	files: FileInterface[] = [
		{
			displayName: "Config",
			filename: "hyper.js.bak",
			path: `${getUserHome()}/.hyper.js`
		}
	]
	moduleName = "HyperJS"
}
