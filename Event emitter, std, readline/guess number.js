import process from 'node:process'
import readline from 'node:readline'
import randomNumber from './randomNumber.js'

const rl = readline.createInterface({input: process.stdin, output: process.stdout})
const number = randomNumber()

process.stdout.write('Загадано число в диапазоне от 0 до 100\n')

rl.on('line', (message) => {
	if (message < number) {
    process.stdout.write('Больше\n')
  } else if (message > number) {
		process.stdout.write('Меньше\n')
	} else if (message == number) {
		rl.close()
	} else {
		process.stdout.write('Хз\n')
	}
})

rl.on('close', () => {
  process.stdout.write(`Отгадано число ${number}\n`)
  process.exit(0)
})