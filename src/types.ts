export interface MediaItem {
    id: string
    title: string
    desc: string
    uploadDate: string;
    channelId: string;
    channelTitle: string;
    thumbnails?: Thumbnails;
    viewCount: number;
    platform: string
}

export interface Actions {
    [key: string]: () => {}
}

export interface Thumbnails {
    default: Metadata;
    medium?: Metadata | null;
    high?: Metadata | null;
    standard?: Metadata | null;
    maxres?: Metadata | null;
}
export interface Metadata {
    url: string;
    width: number;
    height: number;
}

export interface ProfileItem {
    id: string
    userId: string
    username: string
}

export interface ProfileUpdateItem {
    username: string
}

export interface ReviewItem {
    id: string
    mediaId: string
    userId: string
    rating: number
    comment: string
    createdAt?: Date
}