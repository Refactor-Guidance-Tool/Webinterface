export type RefactorSetting = {
    label: string,
    identifier: string,
    type: string,
    required: boolean
}

export type SubjectRefactorSetting = {
    codeElementType: string
} & RefactorSetting

export type StringRefactorSetting = {
    string: string;
} & RefactorSetting

export type ChoiseRefactorSetting = {
    choises: string[],
} & RefactorSetting

export type BooleanRefactorSetting = {
} & RefactorSetting