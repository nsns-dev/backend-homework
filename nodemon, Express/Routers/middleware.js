import { Router } from 'express'
import { authRouterWrapper } from './Authorization/authorization.js'
import { booksRouterWrapper, booksIdRouterWrapper } from './Books/books.js'
import { BooksHandlers } from '../Handlers/handlers.js'

// books handlers 
const handlers = new BooksHandlers()

// routers
const authorizationRouter = Router()
const booksRouter = Router()
const booksIdRouter = Router()

export const booksRouters = [
	authRouterWrapper(authorizationRouter),
	booksRouterWrapper(booksRouter, handlers),
	booksIdRouterWrapper(booksIdRouter, handlers),
]