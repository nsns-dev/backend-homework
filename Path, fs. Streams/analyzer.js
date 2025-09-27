import { cwd } from 'node:process'
import { join } from 'node:path'
import { createReadStream } from 'node:fs'
import { readdir } from 'node:fs/promises'

const result = {
  parties: 0,
  win: 0,
  defeat: 0,
  winInPercent: '0%',
}

async function readFromPath(path) {
  return new Promise((resolve, reject) => {
    let data = ''
    const rs = createReadStream(path, { encoding: 'utf-8' })
    rs.on('data', (chunk) => data += chunk)

    rs.on('end', () => {
      try {
        const games = JSON.parse(data)
        
        games.forEach(game => {
          result.parties += 1
          if (game.result) result.win += 1
          else result.defeat += 1
        })

        result.winInPercent = Math.round((result.win / result.parties) * 100) + '%'
        resolve()
      } catch (err) {
        reject(new Error(`Ошибка парсинга JSON в файле ${path}: ${err}`))
      }
    })

    rs.on('error', (err) => console.log(`Ошибка чтения файла ${path}: ${err}`))
  })
}

async function analyze() {
  try {
    const logs = await readdir(join(cwd(), 'logs'), { encoding: 'utf-8' })
    
    for (const filename of logs) {
      const filePath = join(cwd(), 'logs', filename)

      try {
        await readFromPath(filePath)
      } catch (err) {
        console.error(`Ошибка при обработке файла ${filename}: ${err}`)
      }
    }

    console.log(`Всего партий: ${result.parties}`)
		console.log(`Побед: ${result.win}`)
		console.log(`Поражений: ${result.defeat}`)
		console.log(`Процент побед: ${result.winInPercent}`)
  } catch (error) {
    console.error('Ошибка во время анализирования логов:\n', error)
  }
}

analyze()