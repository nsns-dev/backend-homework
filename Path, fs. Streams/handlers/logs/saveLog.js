import { createWriteStream } from "node:fs";
import {mkdir} from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from "node:process";

export default async function saveLog(filename, currentSession) {
	try {
		const pathToLog = join(cwd(), 'logs')
		await mkdir(pathToLog, { recursive: true })

		const ws = createWriteStream(join(pathToLog, filename + '.json'), {encoding: 'utf-8'})
		ws.write(JSON.stringify(currentSession, null, 2))
		ws.end()
		ws.on('finish', () => console.log('Файл с логами успешно записан!'))
	} catch (error) {
		console.error('Ошибка во время сохранения логов:\n', error)
	}
}