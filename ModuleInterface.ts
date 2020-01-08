import { SingleBar } from "cli-progress";
import ListI from "./interfaces/Listr";

export default interface ModuleInterface {
	moduleName?: string

	save(): Promise<ListI>
	load(): Promise<ListI>

	isInstalled(): Promise<boolean>
	custom(): Promise<boolean>
}
