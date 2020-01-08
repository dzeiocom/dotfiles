#!/usr/bin/env node
console.clear()

import Logger from './Logger'
import ModuleInterface from './ModuleInterface'
import Options from './Options'
import { getModules } from './Functions'
import ListI, { ListrInterface } from './interfaces/Listr'

const logger = Logger.getInstance()
const options = new Options()

function getSelect(Select: any) {
	return new Select({
		name: "dotfiles",
		message: "Select the action to run",
		choices: [
			{
				name: 'quick-save',
				message: 'Quick Save'
			},{
				name: 'quick-restore',
				message: 'Quick Restore'
			},{
				name: 'save',
				message: 'Save'
			},{
				name: 'restore',
				message: 'Restore'
			},{
				name: 'options',
				message: 'Options'
			},{
				name: 'exit',
				message: 'Exit'
			}
		]
	})
}

async function saveModule(moduleName: string, save = false): Promise<ListI> {
	const md = `./modules/${moduleName}`
	const module: ModuleInterface = new (await require(md).default)(moduleName)
	if (save) {
		return module.save()
	} else {
		return module.load()
	}
}

async function bootstrap(): Promise<never> {
	const { Select, MultiSelect } = await require('enquirer');
	const Listr: ListI = await require('listr')

	let response: string = ""
	try {
		response = await getSelect(Select).run()
	} catch {
		process.exit(process.exitCode)
	}

	const config = options.getConfig()
	const modules = await getModules()
	const quick = config.enabled.filter((el) => modules.includes(el))

	let isSaving = false

	const t: ListrInterface[] = []
	switch (response) {
		case "quick-save":
			isSaving = true
		case "quick-restore":
			for (const mod of quick) {
				t.push({
					title: mod,
					task: async () => saveModule(mod, isSaving)
				})
			}
			break;
		case "save":
			isSaving = true
		case "restore":
			const res = await new MultiSelect({
				name: "mutiSelect",
				message: `Select what to ${response}`,
				choices: modules
			}).run()
			if (res.length === 0) await bootstrap()
			for (const mod of res) {
				t.push({
					title: mod,
					task: async () => saveModule(mod, isSaving)
				})
			}
		break
		case "options":
			await options.manager()
			await bootstrap()
		default:
			break;
	}
	await new Listr(t, {concurrent: false}).run()


	Logger.getInstance().commit()

	return process.exit(process.exitCode)
}

try {
	bootstrap()
} catch(e) {
	logger.log("An error occured 😱")
	console.log(e)
}
