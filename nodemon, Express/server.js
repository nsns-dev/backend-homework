import express from 'express'
import { booksRouters } from './Routers/middleware.js'

const app = express()
const PORT = 1111

app.use(express.json())
booksRouters.forEach(router => app.use(router))
app.listen(PORT, () => console.log(`[ --- Server launch on ${PORT} port --- ]`))