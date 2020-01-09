import ModuleInterface from "./interfaces/ModuleInterface"
import { copy, processCommand } from "./Functions"
import FileInterface from "./interfaces/FileInterface"
import Requirements from "./Prerequises"
import Logger from "./Logger"
import ListI, { ListrInterface } from "./interfaces/Listr"
import Statics from "./Statics"
const Listr: ListI = require('listr')

export default abstract class SimpleModule implements ModuleInterface {

	protected files: FileInterface[] = []

	private installed?: boolean

	private logger = Logger.getInstance()

	abstract moduleName: string

	public constructor(files?: FileInterface[]) {

		if (files) this.files = files
	}

	public async save(): Promise<ListI> {

		const directory = `${Statics.folder}/backups/${this.moduleName}`
		const subTasks: ListrInterface[] = []

		for (const file of this.files) {
			// this.logger.prepare(file.displayName || file.filename)
			const location = `${directory}/${file.filename}`

			let doSkip = false
			if (file.prereqs && !await this.processPrereqs(file)) {
				doSkip = true
			}

			subTasks.push({
				title: file.displayName || file.filename,
				task: async (ctx, task) => {
					// await wait(1000)
					// console.log(task.)
					// this.logger.prepare(task as any)
					if (file.path !== undefined) {
						await copy(file.path, location)
						return
					}
					if (file.commands !== undefined) {
						// console.log(file.commands.save, location, file.filename)
						await processCommand(file.commands.save, location, file.filename)
						return
					}
				},
				skip: () => {
					if (doSkip) {
						const resp = `${this.moduleName} is not installed, skipping ${file.displayName || file.filename}`
						this.logger.prepare(resp)
						return resp
					}
				}
			})
		}
		return new Listr(subTasks, {concurrent: true})
	}

	public async load(): Promise<ListI> {
		const directory = `./backups/${this.moduleName}`
		const subTasks: ListrInterface[] = []

		for (const file of this.files) {
			const location = `${directory}/${file.filename}`
			let doSkip = false
			if (file.prereqs && !await this.processPrereqs(file)) {
				doSkip = true
			}
			subTasks.push({
				title: file.displayName || file.filename,
				skip: () => {
					if (doSkip) {
						const resp = `${this.moduleName} is not installed, skipping ${file.displayName || file.filename}`
						this.logger.prepare(resp)
						return resp
					}
				},
				task: async () => {
					if (file.path !== undefined) {
						await copy(file.path, location)
						return
					}
					if (file.commands !== undefined) {
						await processCommand(file.commands.load, location, file.filename)
					}
				}
			})

			if (file.prereqs && !this.processPrereqs(file)) {
				continue
			}

		}

		return new Listr(subTasks, {concurrent: true})
	}

	public async isInstalled(): Promise<boolean> {
		return true
	}

	public async custom(): Promise<boolean> {
		return true
	}


	private async processPrereqs(file: FileInterface): Promise<boolean> {
		let pre = file.prereqs
		if (typeof pre === "undefined") return true
		if (typeof pre === "string") {
			pre = [pre]
		}

		for (const req of pre) {
			let res = false
			switch (req) {

				case Requirements.INSTALLED:
					if (typeof this.installed === "undefined") {
						this.installed = await this.isInstalled()
					}
					res = this.installed
					if (!res) {
						// this.logger.prepare(`${this.moduleName} is not installed, skipping ${file.displayName || file.filename}`)
						return false
					}
					break

				case Requirements.CUSTOM:
					res = await this.custom()
					break

				default:
					break
			}

			if (!res) {
				return false
			}
		}

		return true
	}













}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		// resolve(); return
		setTimeout(() => {resolve()}, ms)
	})
}
