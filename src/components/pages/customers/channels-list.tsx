import { Fragment } from "react"

const mapChannelToFullName: Record<string, string> = {
  email: "Email",
  inbox: "Inbox",
  sms: "SMS",
}

function ChannelsList({ list }: { list: string[] }) {
  return (
    <>
      {list?.map((channel, idx) => (
        <Fragment key={idx}>
          {mapChannelToFullName[channel] || channel}
          {idx < list.length - 1 && ", "}
        </Fragment>
      ))}
    </>
  )
}

export default ChannelsList
