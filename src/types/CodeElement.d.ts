export type ElementPosition = {
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number
}

export type CodeElement = {
	name: string,
    position: ElementPosition,
    type: string,
    file: string
}