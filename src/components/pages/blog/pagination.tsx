"use client"

import { useRouter } from "next/navigation"
import { ROUTE } from "@/constants/routes"
import { ArrowLeft, ArrowRight } from "lucide-react"
import ReactPaginate from "react-paginate"

import { cn } from "@/lib/utils"

interface IPaginationProps {
  currentPage: number
  pageCount: number
  path?: string
  className?: string
}

function Pagination({
  currentPage,
  pageCount,
  className,
  path = "",
}: IPaginationProps) {
  const router = useRouter()

  const hrefBuilder = (page: number, pageQty: number) => {
    const basePath = !path ? ROUTE.blog : `${ROUTE.blogCategory}/${path}`
    const pageNumber = page > 1 && page <= pageQty ? `/page/${page}` : ""

    return basePath + pageNumber
  }

  const handlePageClick = ({ selected }: { selected: number }) => {
    const page = selected + 1

    const basePath = !path ? ROUTE.blog : `${ROUTE.blogCategory}/${path}`

    const navigateTo = page === 1 ? basePath : `${basePath}/page/${page}`

    router.push(navigateTo.toString())
  }

  return (
    <nav className={cn(className)}>
      <ReactPaginate
        breakLabel="..."
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        forcePage={currentPage - 1}
        hrefBuilder={hrefBuilder}
        containerClassName="flex justify-center items-center gap-x-3 [&>li]:leading-snug"
        pageLinkClassName="flex size-9 justify-center items-center rounded-lg font-medium text-sm tracking-tight border border-transparent leading-none transition-colors duration-300 rounded hover:text-gray-8"
        breakLinkClassName="flex size-9 justify-center items-center rounded-lg font-medium text-sm tracking-tight border border-transparent leading-none transition-colors duration-300 hover:text-gray-8"
        activeLinkClassName="border border-gray-3! bg-gray-1 rounded-lg pointer-events-none"
        previousClassName="mr-auto flex self-stretch"
        nextClassName="ml-auto flex self-stretch"
        previousLinkClassName="mr-auto flex items-center gap-x-1.5 text-sm text-foreground transition-colors duration-300 hover:text-gray-9 md:mr-12 rounded hover:[&_svg]:-translate-x-0.5"
        nextLinkClassName="ml-auto flex items-center gap-x-1.5 text-sm text-foreground transition-colors duration-300 hover:text-gray-9 md:ml-12 rounded hover:[&_svg]:translate-x-0.5"
        disabledLinkClassName="pointer-events-none text-gray-6"
        previousLabel={
          <>
            <ArrowLeft
              className="shrink-0 transition-transform duration-300"
              size={14}
              strokeWidth={2.5}
            />
            <span className="-ml-0.5 hidden leading-none tracking-tight md:inline-flex">
              Previous
            </span>
          </>
        }
        nextLabel={
          <>
            <span className="-mr-0.5 hidden leading-none tracking-tight md:inline-flex">
              Next
            </span>
            <ArrowRight
              className="shrink-0 transition-transform duration-300"
              size={14}
              strokeWidth={2.5}
            />
          </>
        }
        renderOnZeroPageCount={null}
        onPageChange={handlePageClick}
      />
    </nav>
  )
}

export default Pagination
