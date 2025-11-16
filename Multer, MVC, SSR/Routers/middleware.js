import { Router } from 'express'
import { booksApiRouterWrapper } from './Books/books.js'
import booksMethods from '../Controller/controller.js'
import { upload } from '../Upload/upload.js'

// routers
const booksRouter = Router()

export const booksRouters = [booksApiRouterWrapper(booksRouter, booksMethods, upload)]