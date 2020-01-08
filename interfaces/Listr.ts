export default interface ListI {
	new (list: ListrInterface[], options?: ListrOptions): ListI
	run: () => Promise<void>
}

export interface ListrOptions {
	concurrent?: boolean
}

export interface ListrInterface {
	title: string,
	enabled?: (ctx: any) => boolean,
	skip?: (ctx?: any) => string|undefined|boolean|Promise<string|undefined|boolean>,
	task: (ctx?: any, task?: Task) => (void|string|ListI|Promise<void|string|ListI>)
}

export interface Task {
	skip: (str: string) => boolean|string|undefined
}
