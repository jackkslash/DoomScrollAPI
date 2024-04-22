import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { mediaRoute } from './routes/media'
import { processRoute } from './routes/process'
import { profileRoute } from './routes/profile';
import { analyticsRoute } from './routes/analytics';
import { creatorRoute } from './routes/creator';

require('dotenv').config()

const app = new Hono()
app.use('*', cors({
    origin: '*', // Be cautious, this allows all origins
}));

app.get('/', (c) => c.json({ message: "hello" }))
app.route('/process', processRoute)
app.route('/media', mediaRoute)
app.route('/analytics', analyticsRoute)
app.route('/profile', profileRoute)
app.route('/creator', creatorRoute)
app.notFound((c) => c.json({ message: "Not a valid API route." }, 404));

serve(app)