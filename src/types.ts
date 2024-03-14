export interface mediaObj {
    id: string
    title: string
    desc: string
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    thumbnails?: Thumbnails;
    tags?: (string)[] | null;
    platform: string
}

export interface Actions {
    [key: string]: () => {}
}

export interface Thumbnails {
    default: Metadata;
    medium: Metadata | null;
    high: Metadata | null;
    standard: Metadata | null;
    maxres: Metadata | null;
}
export interface Metadata {
    url: string;
    width: number;
    height: number;
}



