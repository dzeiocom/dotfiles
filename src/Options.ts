import { getModules } from "./Functions"
import fs, { promises as fsp } from "fs"
import 'colors'
import Statics from './Statics'
import inquirer, { DistinctChoice } from "inquirer"

const { MultiSelect, Select } = require('enquirer')

interface p {
	override?: boolean
	enabled: string[]
}

export default class Options {

	private configFolder = Statics.folder
	private configFile = `config.yml`

	private location: string

	private config: p

	private static defaultReadme = `
# Dotfiles

_This dotfiles was generated using https://www.npmjs.com/package/@dzeio/dotfiles_
	`


	public constructor() {
		this.location = `${this.configFolder}/${this.configFile}`
		try {
			fs.accessSync(this.location)
			this.config = JSON.parse(fs.readFileSync(this.location).toString())
		} catch {
			fs.mkdirSync(this.configFolder)
			this.config = this.defaultConfig()
			fs.writeFileSync(`${this.configFolder}/README.md`, Options.defaultReadme)
			this.save()
		}
	}

	private defaultConfig(): p {
		return {
			enabled: [
				"Dotfiles"
			]
		}
	}


	public getConfig(): p {
		return this.config
	}

	public setConfig(config: p) {
		this.config = config
	}

	public async save() {
		await fsp.writeFile(this.location, JSON.stringify(this.config))
	}

	public async manager() {
		const resp = await inquirer.prompt({
			type: 'list',
			name: 't',
			message: 'Select an option'.white,
			choices: [
				{
					name: 'Quick Backup Elements',
					value: 'qbe'
				},
				{
					name: 'Default file override',
					value: 'dfo'
				},
				'Back'
			]
		})
		switch (resp.t) {
			case 'qbe':
				await this.enabled()
				break

			case 'dfo':
				await this.override()
				break
			default:
				return
		}
		await this.manager()
	}

	public async override() {
		let config = this.getConfig()
		// const res = await new Select({
		// 	name: 'select',
		// 	message: 'Default Override action ?'.white,
		// 	footer: `current: ${this.getConfig().override}`,
		// 	choices: [
		// 		{message: "Override", value: true},
		// 		{message: "Ask", value: undefined},
		// 		{message: "Skip", value: false}
		// 	]
		// }).run()
		const res = await inquirer.prompt({
			type: 'list',
			name: 'select',
			message: 'Default Override action ?'.white,
			default: this.getConfig().override,
			choices: [
				{
					name: "Override",
					value: true
				},
				{
					name: "Ask",
					value: undefined
				},
				{
					name: "Skip",
					value: false
				}
			]
		})
		config.override = res.select
		this.setConfig(config)
		this.save()
	}

	public async enabled() {
		let choices: Array<{name: string, value: string}> = []
		const els = await getModules()
		let config = this.getConfig()
		for (const value of els) {
			choices.push({
				name: value,
				value
			})
		}

		const t = await inquirer.prompt({
			type: 'checkbox',
			name: 't',
			message: 'Select which one to Backup/Restore when selecting quick'.white,
			choices,
			default: this.getConfig().enabled.filter((el) => els.includes(el))
		})
		config.enabled = t.t
		this.setConfig(config)
		this.save()
	}
}
