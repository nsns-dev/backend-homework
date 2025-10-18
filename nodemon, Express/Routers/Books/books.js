const booksRouterWrapper = (booksRouter, handlers) => {
  booksRouter
		.route('/api/books/')
		.get(async (req, res) => {
			try {
				const books = await handlers.getBooks()
				res.status(200).send(books)
			} catch (err) {
				res.status(500).send({ error: `Interval Server Error` })
			}
		})
		.post(async (req, res) => {
			const { title, description, authors, cover } = req.body

			if (!title || !description || !authors || !cover) {
				res.status(400).json({
					error: 'Missing required fields',
					missingFields: ['title', 'description', 'authors', 'cover'].filter(
						field => !req.body[field]
					),
				})
			}

			try {
				const newBook = await handlers.addBooks({
					title,
					description,
					authors,
					cover,
				})
				res
					.status(201)
					.send({ message: 'New book added successfully', book: { newBook } })
			} catch (err) {
				res.status(500).send({ error: `Interval Server Error` })
			}
		})
    return booksRouter
}

const booksIdRouterWrapper = (booksIdRouter, handlers) => {
  booksIdRouter
  .route('/api/books/:id')
  .get(async (req, res) => {
    try {
      const { id } = req.params
      const findBook = await handlers.findBookById(id)

      if (!findBook) {
				return res.status(404).send({ error: `Book with ID '${id}' not found` })
			}
    
      res.status(200).send(findBook)
    } catch (error) {
      res.status(500).send({error: `Interval Server Error`})
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params
      const deleteProcess = await handlers.deleteBookById(id)
      if (!deleteProcess) {
        return res.status(404).send({error: `The book with ID: ${id} don't exist, can't be deleted`})
      }
      res.status(200).send({status: 'success', message: `Book with ID: ${id} successfully deleted`})
    } catch (error) {
      res.status(500).send({ error: 'Interval Server Error' })
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.params
      const updates = req.body
      if (Object.keys(updates).length === 0) {
				return res.status(400).send({ error: 'Request body must not be empty' })
			}
      const updateProcess = await handlers.updateBookById(id, updates)
      if (!updateProcess) {
				return res
					.status(404)
					.send({
						error: `The book with ID: ${id} don't exist, can't be changed`,
					})
			}
      res.status(200).send({status: 'success', message: `Book with ID: ${id} successfully updated`})
    } catch (error) {
      res.status(500).send({ error: 'Interval Server Error' })
    }
  })
  return booksIdRouter
}

export { booksRouterWrapper, booksIdRouterWrapper }