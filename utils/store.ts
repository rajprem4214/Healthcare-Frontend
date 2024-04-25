export interface Paging<T> {
    data: Array<T>
    pageNo: number
    count: number
    maxPage: number
    actions: {
        refresh: (force?: boolean) => Promise<void>
        reset: () => void
        getPage: (page: number) => void
    }
}
