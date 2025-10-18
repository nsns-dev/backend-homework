import { readFile, writeFile } from 'node:fs/promises'

export class BooksHandlers {
	constructor() {
		this.booksHash = new Map()
	}

	async setBooks() {
		try {
			const books = await readFile('./db/books.json', 'utf-8')
			const parsedBooks = JSON.parse(books)
			parsedBooks.forEach(book => this.booksHash.set(book.id, book))
		} catch (error) {
			console.error(`Error, can't execute books list in setBooks():
${error}`)
			throw error
		}
	}

	async getBooks() {
		await this.checkBooksMap()
		return this.convertMapToJSON(this.booksHash)
	}

	async addBooks(bookObj) {
		try {
			const { title, description, authors, cover } = bookObj
			await this.checkBooksMap()
			const newBook = {
				id: this.booksHash.size + 1,
				title: title,
				description: description,
				authors: Array.isArray(authors) ? authors : [authors],
				cover: cover,
			}
			this.booksHash.set(newBook.id, newBook)
			const booksJSON = this.convertMapToJSON(this.booksHash)
			await this.refreshBooksJSON(booksJSON)
			return newBook
		} catch (error) {
			console.error(`Error, can't add books in addBooks():
${error}`)
			throw error
		}
	}

	async findBookById(id) {
		try {
			const books = await this.checkBooksMap()
			const book = books.get(id)
			return book ? book : false
		} catch (error) {
			console.error(`Error, find book by id in findBookById():
${error}`)
			throw error
		}
	}

	async deleteBookById(id) {
		try {
			const books = await this.checkBooksMap()
			if (!books.has(id)) {
				return false
			} else {
				books.delete(id)
				const booksJSON = this.convertMapToJSON(books)
				await this.refreshBooksJSON(booksJSON)
				return true
			}
		} catch (error) {
			console.error(`Error, delete book by id in deleteBookById():
${error}`)
			throw error
		}
	}

	async updateBookById(id, updates) {
		try {
			const books = await this.checkBooksMap()
			if (!books.has(id)) {
				return false
			} else {
				const book = books.get(id)
				const updatedBook = {
					...book,
					...updates,
				}
				books.set(id, updatedBook)
				const booksJSON = this.convertMapToJSON(books)
				await this.refreshBooksJSON(booksJSON)
				return true
			}
		} catch (error) {
			console.error(`Error, change book by id in updateBookById():
${error}`)
			throw error
		}
	}

	async checkBooksMap() {
		if (!this.booksHash.size) {
			await this.setBooks()
		}
		return this.booksHash
	}

	async refreshBooksJSON(booksObj) {
		try {
			await writeFile('./db/books.json', JSON.stringify(booksObj, null, 2), {
				encoding: 'utf-8',
			})
			await this.setBooks()
		} catch (error) {
			console.error(
				`Error, refreshing books json in refreshBooksJSON():
${error}`
			)
			throw error
		}
	}

	convertMapToJSON(booksMap) {
		try {
			const booksJSON = [...Array.from(booksMap.values())]
			return booksJSON
		} catch (error) {
			console.error(
				`Error, converting map to json in convertMapToJSON():
${error}`
			)
			throw error
		}
	}
}
