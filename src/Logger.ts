export default class Logger {

	private messages: Array<string> = []

	private static instance?: Logger
	public static getInstance(): Logger {
		if (!this.instance) {
			this.instance = new Logger()
		}
		return this.instance
	}

	public prepare(message: string) {
		this.messages.push(message)
	}

	public commit() {
		for (const message of this.messages) {
			this.log(message)
		}
	}

	public log(message: string) {
		console.log(message)
	}
}
