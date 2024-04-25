export interface PaginationFilter {
    sort?: {
        field: string
        value: string
    }
    fieldsToInclude?: Array<string>
}
