import CareersInterestForm from "./interest-form"

function CareersForm() {
  return (
    <section
      className="scroll-mt-16 px-5 pb-50 md:scroll-mt-28 md:px-8"
      id="apply"
    >
      <div className="mx-auto max-w-192">
        <div className="text-center">
          <h2 className="text-[2.5rem] leading-dense font-medium tracking-tighter text-white md:text-[3.25rem]">
            Want to work with us?
          </h2>
          <div className="mt-5 space-y-2.5 text-lg leading-normal tracking-tighter text-gray-8">
            <p>
              We&apos;re not hiring at the moment, but we&apos;re always
              interested in meeting people who care about open-source developer
              tools, product communication, and building useful infrastructure.
            </p>
            <p>
              Tell us a bit about yourself and we&apos;ll reach out when a
              relevant role opens up.
            </p>
          </div>
        </div>
        <CareersInterestForm />
      </div>
    </section>
  )
}

export default CareersForm
