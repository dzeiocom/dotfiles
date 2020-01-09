import SimpleModule from "../SimpleModule";
import fsSync from "fs";
import { getUserHome } from "../Functions";

import { execSync } from "child_process";
import FileInterface from "../interfaces/FileInterface";
import Requirements from "../Prerequises";

export default class VSCode extends SimpleModule {
	files: FileInterface[] = [
		{
			displayName: "Settings",
			filename: "settings.json",
			path: `${this.findVSCodeFolder()}/User/settings.json`
		},
		{
			displayName: "Keybindings",
			filename: "keybindings.json",
			path: `${this.findVSCodeFolder()}/User/keybindings.json`
		},
		{
			displayName: "Snippets",
			filename: "snippets",
			path: `${this.findVSCodeFolder()}/User/snippets`
		},
		{
			displayName: "Extensions",
			filename: "extensions.txt",
			prereqs: Requirements.INSTALLED,
			commands: {
				save: `${this.findCommand()} --list-extensions`,
				load: `${this.findCommand()} --install-extension {line}`
			}
		}
	]

	public moduleName: string

	public constructor() {
		super()
		const filename = __filename.split("/")
		this.moduleName = filename[filename.length - 1].replace(".ts", "")
	}

	private static commands = ["vscodium", "vscode", "code", "codium"]

	private findVSCodeFolder(): string {
		const possibilities = [
			`${getUserHome()}/.config/Code`,
			`${getUserHome()}/.config/VSCodium`,
			`${getUserHome()}/.config/Code - OSS`,
		]
		for (const pos of possibilities) {
			try {
				fsSync.accessSync(pos)
				return pos
			} catch {continue}
		}
		return possibilities[0] // default to VSCode folder
	}

	private findCommand(): string {
		for (const cmd of VSCode.commands) {
			try {
				execSync(`which ${cmd}`)
				return cmd
			} catch {
				continue
			}
		}
		return ""
	}

	public async isInstalled(): Promise<boolean> {
		return this.findCommand() !== ""
	}

}
