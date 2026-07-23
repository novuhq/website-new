export interface ICareerJob {
  _id: string
  jobId: number
  title: string
  department: string
  workplaceType: string
  hours: string
  location: string
  applicationUrl: string
  publishedAt: string
  slug: string
}

export interface ICareerJobDetail extends ICareerJob {
  content: ICareerJobContentBlock[]
  plainContent: string
}

export type ICareerJobContentBlock =
  | {
      _type: "heading"
      level: 2 | 3
      text: string
    }
  | {
      _type: "paragraph"
      text: string
    }
  | {
      _type: "bulletedList"
      items: string[]
    }
