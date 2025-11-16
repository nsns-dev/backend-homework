const booksApiRouterWrapper = (booksRouter, booksMethods, upload) => {
  booksRouter.get('/books', async (req, res, next) => {
		try {
			const books = await booksMethods('getBooks')
			res.render('books', {titlePage: 'Books List', books: books || []})
		} catch (error) {
			next(error)
		}
	})
	
	booksRouter
		.route('/books/create')
		.get((req, res) => res.render('create', {titlePage: 'Add Book'}))
		.post(upload.single('file_upload'), async (req, res, next) => {
			try {
				const bookObj = req.body
				const new_book = {
					title: bookObj.title,
					authors: bookObj.authors,
					description: bookObj.description,
					favourites: bookObj.favourites,
					cover: bookObj.cover,
					file_upload: req.file ? req.file.path : null,
				}
				const addProcess = await booksMethods('addBook', new_book)
	
				if (!addProcess) {
					res
						.status(500)
						.render('create', {
							titlePage: 'Add Book',
							bookStatus: 'Ошибка во время добавления. Попробуйте еще раз',
						})
					return
				}
	
				res.status(200).render('create', { titlePage: 'Add Book', bookStatus: 'Книга успешно добавлена' })
			} catch (error) {
				next(error)
			}
		})
	
	booksRouter
		.route('/books/view')
		.get((req, res) => res.render('view', { titlePage: 'View Book', book: null}))
		.post(async (req, res, next) => {
			try {
				const booksObj = req.body
				const foundedBook = await booksMethods('findBook', booksObj)
			
				if (!foundedBook) {
					res.status(404).render('view', { titlePage: 'View Book', book: {}, foundedBookTitle: booksObj.title})
				}
			
				res
					.status(200)
					.render('view', { titlePage: 'View Book', book: foundedBook })
			} catch (error) {
				next(error)
			}
		})
	
	booksRouter.get('/books/:id/edit', async (req, res, next) => {
			try {
					const { id } = req.params;
					const book = await booksMethods('findBookById', { id });
	
					if (!book) {
							return res.status(404).render('update', {
									titlePage: 'Update Book',
									bookNotFound: 'Книга не найдена.',
							});
					}
	
					res.render('update', {
							titlePage: 'Update Book',
							foundedBook: book,
					});
			} catch (error) {
					next(error)
			}
	});
	
	booksRouter.post('/books/:id/update', upload.single('file_upload'), async (req, res, next) => {
			try {
					const { id } = req.params;
					const updatedBook = {
							...req.body,
							file_upload: req.file ? req.file.path : null
					};
	
					const updateProcess = await booksMethods('updateBookById', { id, ...updatedBook });
	
					if (!updateProcess) {
							return res.status(500).render('update', {
									titlePage: 'Update Book',
									failedUpdateProcess: 'Ошибка во время обновления книги, попробуйте еще раз',
							});
					}
	
					res.redirect(`/books`);
			} catch (error) {
					next(error)
			}
	});

	return booksRouter
}

export { booksApiRouterWrapper }