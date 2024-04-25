export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout | null

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args)
            timeoutId = null
        }, delay)
    } as T
}

export function getAppropriateFHIRQuestionnaireInitial(data: unknown) {
    switch (typeof data) {
        case "number":
            return { valueInteger: data }
        case "boolean":
            return { valueBoolean: data }
        default:
            return { valueString: data }
    }
}
