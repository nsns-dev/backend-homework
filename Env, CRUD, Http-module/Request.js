export default class Request {
	constructor(rl, weather_api, process, https) {
		this.rl = rl
		this.weather_api = weather_api
		this.process = process
		this.https = https
	}

	requestLayout(location = 'Москва') {
		return `https://api.weatherstack.com/current?access_key=${this.weather_api}&query=${location}`
	}

	async fetchWeather(location) {
			return new Promise((resolve, reject) => {
				this.https.get(this.requestLayout(location), (response) => {
					let data = ''
	
					response.on('data', (chunk) => data += chunk)
					response.on('end', () => {
						try {
							resolve(JSON.parse(data))
						} catch (error) {
							reject(error)
						}
					response.on('error', (error) => reject(error))
				})
			}).on('error', (error) => reject(error))
		})
	}

	askCustomCity() {
		this.rl.question('\nВведите название города: ', async answer => {
			const location = answer.trim().toLowerCase()
			if (!location) {
				console.log('Город не указан, попробуй снова')
				this.askCustomCity()
				return
			}
			console.log(`\nЗагружаю погоду для ${location}`)
			try {
				const data = await this.fetchWeather(location)
				console.log(data)
			} catch (error) {
				console.error(`Ошибка:\n${error}`)
			} finally {
				this.rl.close()
				this.process.exit(0)
			}
		})
	}

	async cityInfo() {
		try {
			this.rl.question(
				'Привет! Выберите вариант:\n' +
					'1) Москва (по умолчанию)\n' +
					'2) Другой город\n' +
					'Введите номер варианта (1 или 2): ',
				async answer => {
					const choice = answer.trim()

					switch (choice) {
						case '1':
							console.log('Загружаю погоду для Москвы...')
							const dataMoscow = await this.fetchWeather()
							console.log(dataMoscow)
							this.rl.close()
							this.process.exit(0)
							break

						case '2':
							this.askCustomCity()
							return

						default:
							console.log('\nЗагружаю погоду для Москвы...')
							const dataDefault = await this.fetchWeather()
							console.log(dataDefault)
							this.rl.close()
							this.process.exit(0)
							break
					}
				}
			)
		} catch (err) {
			console.error(`Ошибка в cityInfo:\n${err}`)
			this.rl.close()
			this.process.exit(1)
		}
	}

  startApp() {
    return this.cityInfo()
  }
}