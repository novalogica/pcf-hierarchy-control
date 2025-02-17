import { Column } from "./column"

export interface Form {
  formId: string,
  label: string,
  columns: Column[]
}