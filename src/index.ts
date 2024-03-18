import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { mediaRoute } from './routes/media'
import { processRoute } from './routes/process'


const app = new Hono()
app.get('/', (c) => c.json({ message: "hello" }))
app.route('/process', processRoute)
app.route('/media', mediaRoute)
app.notFound((c) => c.json({ message: "Not a valid API route." }, 404));

serve(app)