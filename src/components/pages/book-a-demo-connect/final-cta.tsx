import BookADemoSchedulingActions from "@/components/pages/book-a-demo/scheduling-actions"
import ConnectFinalCta from "@/components/pages/connect/final-cta"

function BookADemoConnectFinalCta() {
  return (
    <ConnectFinalCta
      sectionClassName="pb-68 md:pb-100 lg:pb-104 xl:pt-62.5 xl:pb-120"
      containerClassName="max-w-272"
      videoClassName="w-234 max-w-none md:w-403.25 xl:w-480"
      title={
        <>
          <span>See how Novu Connect fits</span>
          <br className="hidden sm:block" aria-hidden />
          <span className="sm:hidden"> </span>
          <span>your enterprise agent stack</span>
        </>
      }
      description="Talk with our team about your agents, customer channels, security requirements, and deployment path."
      descriptionClassName="max-w-142"
      actionSlot={
        <BookADemoSchedulingActions
          clickLocation="book_a_demo_connect_cta"
          source="book_a_demo_connect"
        />
      }
    />
  )
}

export default BookADemoConnectFinalCta
