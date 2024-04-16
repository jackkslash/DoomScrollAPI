import { Hono } from 'hono'
import { Actions, MediaItem } from '../types'
import db from '../db/db'
import { media } from '../db/schema'
import { eq } from 'drizzle-orm'

export const processRoute = new Hono()

processRoute.post('/', async (c) => {
    const link: any = c.req.query('link')
    const pLink: any = await processLink(link);
    return c.json({
        pLink
    })
})

function processLink(link: string) {
    const domain = getDomain(link);
    // Define actions for each domain
    const actions: Actions = {
        'youtube.com': async () => {
            const videoID: any = extractVideoId(link)
            const existingItem = await searchVideoID(videoID)
            if (existingItem.length > 0) {
                return { existing: true, item: existingItem[0] }
            } else {
                const res = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" + videoID + "&key=" + process.env.YOUTUBE_APIKEY)
                const body: any = await res.json();
                console.log(body)
                const { items } = body
                const [firstItem] = items
                const { id, snippet } = firstItem
                const { title, description, channelId, channelTitle, publishedAt, thumbnails } = snippet

                const mediaObj: MediaItem = {
                    id: id,
                    title: title,
                    desc: description,
                    uploadDate: publishedAt,
                    channelId: channelId,
                    channelTitle: channelTitle,
                    platform: 'youtube',
                    thumbnails: thumbnails,
                    viewCount: 0
                }
                await db.insert(media).values(mediaObj)
                return { existing: false, item: mediaObj }
            }

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

    // Ensure domain is not null before accessing actions[domain]
    if (domain !== null && actions[domain]) {
        return actions[domain]();
    } else {
        return console.log("Unknown domain");
    }

}

const getDomain = (url: string) => {
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

async function searchVideoID(url: string) {
    const q = await db.query.media.findMany({
        where: eq(media.id, url)
    })
    console.log(q)
    return q;

}