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

export type CareerDepartment = (typeof CAREER_DEPARTMENTS)[number]

export function isCareerDepartment(value: unknown): value is CareerDepartment {
  return (
    typeof value === "string" &&
    CAREER_DEPARTMENTS.includes(value as CareerDepartment)
  )
}
