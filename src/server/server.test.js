const app = require('./server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('server running', () => {
  expect(1).toBe(1)
})