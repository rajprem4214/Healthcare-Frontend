declare type uploadFilesResponse = {
    data: {
        id: string,
        url: string
    }
}

declare type getSignedUrlResponse = {
    data: {
        message: string,
        signedUrl: string
    }
}
