import { Hono } from 'hono'
import { rateLimiter } from "./middleware/rateLimiter";

const app = new Hono()

app.use(rateLimiter);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app