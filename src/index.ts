import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

require('dotenv').config()


const app = new Hono()
app.get('/', (c) => c.json({ message: "hello" }))

app.get('/process', async (c) => {
    const link: any = c.req.query('link')
    const pLink: any = await processLink(link);
    return c.json({
        pLink
    })
})

function processLink(link: any) {
    const domain = getDomain(link);
    // Define actions for each domain
    const actions: any = {
        'youtube.com': async () => {
            const videoID = extractVideoId(link)
            const res = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" + videoID + "&key=" + process.env.YOUTUBE_APIKEY)
            const body: any = await res.json();
            console.log(body)
            const mediaObj = {
                id: body.items[0].id,
                title: body.items[0].snippet.title,
                desc: body.items[0].snippet.description
            }

            return mediaObj;
        },
        'tiktok.com': () => {
            console.log(link)
            return link;
        },
        'instagram.com': () => {
            console.log(link)
            return link;
        },
        // Add more cases as needed
    };

    // Execute action based on domain or default action
    return actions[domain] ? actions[domain]() : console.log("Unknown domain");
}

const getDomain = (url: any) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?([^:/?#]+)(?:.*)/i;
    // Use regex to extract domain from URL
    const match = url.match(regExp);
    // Return link if found, otherwise return null
    return match ? match[1] : null;
};

function extractVideoId(url: string) {
    // Regular expression to match YouTube video IDs
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    // Extract video ID from the URL
    const match = url.match(regExp);
    // Return video ID if found, otherwise return null
    return match ? match[1] : null;
}


serve(app)