const authRouterWrapper = authRouter => {
  authRouter.route('/api/user/login').post((req, res) => {
    try {
      res.status(201).send({ id: 1, mail: 'test@mail.ru' })
    } catch (error) {
      res.status(500).send({ error: `Interval Server Error` })
    }
  })
  return authRouter
}  

export { authRouterWrapper }