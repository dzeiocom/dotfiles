import Requirements from "../Prerequises";

export default interface FileInterface {
	displayName?: string,
	filename: string // name of the file in the internal system **MUST** be unique
	path?: string // if set it will copy the folder/file from path to filename
	prereqs?: Requirements|Array<Requirements>
	commands?: { // if set see below
		save: string // one command to be launch and the result will be saved internally
		load: string // one command to be launched on restoration
		/*
			{filepath} = path of the internal file
			(if set on save the result content will be ignored)

			load only (only one can be in):
			{line} = one line in the internal file (if set the command will be launched for each lines)
			// NOT IMPLEMENTED: {content} = the whole content of the file
		*/
	}
}
