import { BooksHandlers } from '../Handlers/handlers.js'

const booksController = new BooksHandlers()

const methods = {
	getBooks: () => booksController.getBooks(),
	addBook: bookObj => booksController.addBooks(bookObj).then(result => !!result),
	findBook: bookObj => booksController.findBookByName(bookObj),
	updateBook: bookObj => booksController.updateBookById(bookObj),
	findBookById: ({ id }) => booksController.findBookById(id),
	updateBookById: ({ id, ...updates }) =>
		booksController.updateBookById(id, updates),
}

const booksMethods = async (methodName, booksObj) => {
	if (methods[methodName]) {
		return await methods[methodName](booksObj)
	}
	throw new Error(`Method ${methodName} not found`)
}

export default booksMethods
