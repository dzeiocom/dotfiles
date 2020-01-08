import SimpleModule from "../SimpleModule"
import FileInterface from "../FileInterface"
import Requirements from "../Prerequises"
import { execSync } from "child_process"

export default class OhMyFish extends SimpleModule {
	files: FileInterface[] = [
		{
			filename: "Extensions",
			prereqs: Requirements.INSTALLED,
			commands: {
				save: `${this.findCommand()} "omf list | tr '\\t' '\\n"' | grep '^[a-z-]' > {filepath}`,
				load: `${this.findCommand()} "omg install {line}"`
			}
		}
	]
	moduleName = "OhMyFish"

	private findCommand(): string {
		try {
			execSync('which fish 2> /dev/null')
			execSync('which omf 2> /dev/null')
			return 'fish -c'
		} catch {
			return ""
		}
	}

	async isInstalled(): Promise<boolean> {
		return this.findCommand() !== ""
	}
}
