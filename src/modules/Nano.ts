import SimpleModule from "../SimpleModule"
import FileInterface from "../interfaces/FileInterface"
import { getUserHome } from "../Functions"

export default class Nano extends SimpleModule {
	files: FileInterface[] = [
		{
			filename: "Nanorc",
			path: `${getUserHome()}/.nanorc`
		}
	]
	moduleName = "Nano"
}
