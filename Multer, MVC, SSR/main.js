import express from 'express'
import path from 'path'
import { booksRouters } from './Routers/middleware.js'
import errorHandler from './Error/errorMiddleware.js'

const app = express()
const PORT = 11111

app.use('/static', express.static('static'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
booksRouters.forEach(router => app.use(router))

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', async (req, res) => res.render('index', {titlePage: 'Main Page'}))

app.get('/download/uploads/:filename', (req, res) => {
	try {
		const filename = req?.params?.filename

		if (!filename) {
			res.status(400).send({ message: 'Filename not provided.' })
			return
		}

    const safeFilename = path.basename(filename)
    const filePath = path.join('uploads', safeFilename)

		res.download(filePath, safeFilename, err => {
			if (err) {
				console.error(`Error downloading file ${safeFilename}: ${err.message}`)
				res.status(404).send({ message: 'Файл не найден. Попробуй еще раз' })
			}
		})
	} catch (error) {
		console.error(`Error in file download route: ${error.message}`)
		res.status(500).send({ message: 'Internal Server Error' })
	}
})

app.use((req, res, next) => {
  res.status(404).send({ message: `Server Error`})
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server launched at ${PORT} port`))
