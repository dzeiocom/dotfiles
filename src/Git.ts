import { promises as fs} from 'fs'
import Statics from './Statics'
import { exec, ChildProcess } from 'child_process'
import { cmdExistSync } from './Functions'
import { Readable } from 'stream'

export default class Git {

	private isInstalled: boolean

	public constructor() {
		this.isInstalled = cmdExistSync('git')
	}

	public async isInitiated(): Promise<boolean> {
		if (!this.isInstalled) return false
		try {
			await this.run('git status')
			return true
		} catch {
			return false
		}
	}

	// public async show() {
	// 	const res = new Select({

	// 	}).run()
	// }

	public async hasChanges(): Promise<boolean> {
		if (!await this.isInitiated()) throw new Error('Repo is not initied !')
		const { stdout } = await this.run('git status --porcelain')
		const res = stdout ? await streamToString(stdout) : ''
		return res.length > 0
	}

	public async init() {
		const gitFolder = `${Statics.folder}/.git`
		try {
			await fs.access(gitFolder)
		} catch {
			await this.run("git init")
		}
	}

	public async getRemote() {

	}

	private async run(cmd: string): Promise<ChildProcess> {
		return exec(cmd, {
			cwd: Statics.folder
		})
	}
}

function streamToString (stream: Readable): Promise<string> {
	const chunks: any[] = []
	return new Promise((resolve, reject) => {
		stream.on('data', chunk => chunks.push(chunk))
		stream.on('error', reject)
		stream.on('end', () => resolve(chunks.join("")))
	})
}
