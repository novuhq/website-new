export const CAREER_DEPARTMENTS = [
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Customer Success",
  "Design",
  "Operations",
  "Other",
] as const

export const EMPTY_CV_ERROR_MESSAGE =
  "The selected CV file is empty. Please choose a non-empty PDF, DOC, or DOCX file."

export type CareerDepartment = (typeof CAREER_DEPARTMENTS)[number]

export function isCareerDepartment(value: unknown): value is CareerDepartment {
  return (
    typeof value === "string" &&
    CAREER_DEPARTMENTS.includes(value as CareerDepartment)
  )
}
