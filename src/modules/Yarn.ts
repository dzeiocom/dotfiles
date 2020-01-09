import SimpleModule from "../SimpleModule";
import { getUserHome } from "../Functions";
import FileInterface from "../interfaces/FileInterface";

export default class Yarn extends SimpleModule {
	files: FileInterface[] = [
		{
			filename: "yarnrc",
			path: `${getUserHome()}/.yarnrc`
		}
	]
	moduleName = "Yarn"
}
