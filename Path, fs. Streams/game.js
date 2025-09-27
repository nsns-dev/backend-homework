import random from './handlers/game/randomNumber.js'
import moreOrLess from './handlers/game/checkNumber.js'
import compare from './handlers/game/compareNumbers.js'
import readline from 'node:readline'
import process from 'node:process'
import saveLog from './handlers/logs/saveLog.js'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

function ask(question) {
	return new Promise(resolve => rl.question(question, resolve))
}

async function playGame() {
	const guessedNumber = random()

	console.log('\n🎮 Орел и Решка')
	console.log('Я загадал 1 или 2. Попробуй угадать!')

	const input = await ask('Твой выбор (1 или 2): ')
	const userAnswer = parseInt(input)

	if (moreOrLess(userAnswer)) {
		console.log('❌ Число должно быть 1 или 2!')
		return false
	}

	const isWin = compare(guessedNumber, userAnswer)

	if (isWin) {
		console.log(`✅ Ура! Я загадал ${guessedNumber}`)
	} else {
		console.log(`❌ Увы! Я загадал ${guessedNumber}`)
	}

	return {
		timestamp: new Date(),
    guessedNumber,
    userAnswer,
    result: isWin
  }
}

const currentSession = []

async function main() {
	let playing = true

	while (playing) {
		const gameResult = await playGame()
		currentSession.push(gameResult)
		const answer = await ask('\n🎯 Сыграем еще? (да/нет): ')
    
		if (answer.trim().toLowerCase() !== 'да') {
			playing = false
			const filename = await ask('📁 Имя файла для логов: ')
			await saveLog(filename, currentSession)
			console.log(`💾 Логи сохранены в ${filename}`)
			console.log('👋 До встречи!')
		} else {
      console.log('Отлично! Запускаю игру...')
    }
	}
  
	rl.close()
}

main()