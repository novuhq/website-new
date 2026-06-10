import BookADemoSchedulingActions from "@/components/pages/book-a-demo/scheduling-actions"
import ConnectFinalCta from "@/components/pages/connect/final-cta"

function BookADemoConnectFinalCta() {
  return (
    <ConnectFinalCta
      sectionClassName="xl:pt-80 xl:pb-94"
      containerClassName="max-w-272"
      videoClassName="xl:translate-y-16"
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
