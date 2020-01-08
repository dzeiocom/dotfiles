import fsAsync, { promises as fs } from 'fs'
import os from 'os'
import { exec as execSync } from "child_process";
import util from 'util'
import readline from 'readline'
import Options from './Options';
import Logger from './Logger';
import Statics from './Statics';

const { Confirm } = require('enquirer')
const exec = util.promisify(execSync)

export function getUserHome() {
	return os.homedir()
}

export async function processDir(src: string, dest: string) {
	try {
		await fs.mkdir(dest)
	} catch {/*folder already exist*/}
	const files = await fs.readdir(src)
	for (const file of files) {
		const path = `${src}/${file}`
		const fileDest = `${dest}/${file}`
		// console.log(`${src}/${file}`)
		const stats = await fs.stat(path)
		if (stats.isDirectory()) {
			await processDir(path, fileDest)
			continue
		}
		await processFile(path, fileDest)
	}
}

async function processFile(src: string, dest: string) {
	try {
		await fs.access(dest)
		if (!await confirmOverride(dest)) {
			return
		}
	} catch {
		/* File don't exist, continue */
	}

	const folder = dest.substring(0, dest.lastIndexOf("/"))
	await mkdir(folder)
	await fs.copyFile(src, dest)
}

export async function confirmOverride(filename: string): Promise<boolean> {
	const doOverride = new Options().getConfig().override
	if (typeof doOverride === "boolean" ) return doOverride
	Statics.multibar.stop()
	clear()
	const resp = await new Confirm({
		name: "override",
		message: `the file ${filename} is gonna be overrided, continue?`
	}).run()
	if (!resp) {
		return false
	}
	return true
}

async function mkdir(folder: string) {
	try {
		await fs.mkdir(folder, {recursive: true})
	} catch {
		/* folder exists */
	}
}

export function clear() {
	console.clear()
}

export async function copy(src: string, dest: string) {
	try {
		const stats = await fs.stat(src)
		if (stats.isDirectory()) {
			await processDir(src, dest)
		} else {
			await processFile(src, dest)
		}
	} catch {
		Logger.getInstance().prepare(`File/Folder don't exist! ${src}`)
	}
}

/**
 *
 * @param command The command to be launched
 * @param location Location of the internal file
 * @param isRestoring is the system restoring
 */
export async function processCommand(command: string, location: string, filename: string/*, isRestoring: boolean = false*/) {
	const regex = new RegExp(/{(\w+)}/g)
	// const res = regex.exec(command)
	let filepathSet = false
	let lineSet = false
	let res
	while ((res = regex.exec(command)) !== null) {
		console.log(res, res[0], res[1])
		if (res[1] === "filepath") {
			command = command.replace(res[0], location)
			filepathSet = true
		}

		if (res[1] === "line") {
			lineSet = true
		}
	}

	if (filepathSet && !await confirmOverride(filename)) {
		return
	}

	if (lineSet) {
		const stream = fsAsync.createReadStream(location)

		const rl = readline.createInterface({
			input: stream,
			crlfDelay: Infinity
		})

		for await (const line of rl) {
			await exec(command.replace("{line}", line))
		}
		return
	}

	try {
		const {stdout, stderr} = await exec(command)
		if (!filepathSet) {
			const tmp = await fs.mkdtemp("dotfiles")
			const path = `${tmp}/${filename}`
			await fs.writeFile(path, stdout)
			await processFile(path, location)
			await fs.unlink(path)
			await fs.rmdir(tmp)
		}
	} catch {
		Logger.getInstance().prepare(`Error in ${filename}, Command errored`)
	}
}


export async function getModules(): Promise<Array<string>> {
	const res = []
	let els = await fs.readdir("./modules")
	for (const el of els) {
		res.push(
			el.substr(0, el.length-3)
		)
	}
	return res
}

export function capitalize(str: string) {
	return str[0].toUpperCase + str.substr(1).toLowerCase()
}
