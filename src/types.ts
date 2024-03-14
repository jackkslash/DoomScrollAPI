export interface mediaObj {
    id: String
    title: String
    desc: String
}

export interface Actions {
    [key: string]: () => {}
}