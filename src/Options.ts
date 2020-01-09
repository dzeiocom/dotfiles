import { getModules } from "./Functions"
import fs, { promises as fsp } from "fs"
import 'colors'
import Statics from './Statics'

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
		const res = await new Select({
			name: 'select',
			message: 'Select an option',
			choices: [
				'Quick backup elements',
				'default file override',
				'Back'
			]
		}).run()
		switch (res) {
			case 'Quick backup elements':
				await this.enabled()
				break

			case 'default file override':
				await this.override()
				break
			default:
				return
		}
		await this.manager()
	}

	public async override() {
		let config = this.getConfig()
		const res = await new Select({
			name: 'select',
			message: 'Default Override action ?',
			footer: `current: ${this.getConfig().override}`,
			choices: [
				{message: "Override", value: true},
				{message: "Ask", value: undefined},
				{message: "Skip", value: false}
			]
		}).run()
		config.override = res
		this.setConfig(config)
		this.save()
	}

	public async enabled() {
		let choices: Array<choice> = []
		const els = await getModules()
		let config = this.getConfig()
		for (const value of els) {
			choices.push({
				name: value,
				value
			})
		}
		const t = await new MultiSelect({
			name: 'enabled',
			message: 'Select wich one to Backup/Restore when selecting quick'.white,
			initial: this.getConfig().enabled.filter((el) => els.includes(el)),
			choices,
			footer: 'space to select, enter to confirm'
		}).run()
		config.enabled = t
		this.setConfig(config)
		this.save()
	}
}

interface choice {
	name: string,
	value: string
}
