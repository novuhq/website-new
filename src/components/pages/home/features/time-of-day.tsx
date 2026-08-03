"use client"

import { useEffect, useState } from "react"

function getTimeOfDayPhrase(hours: number) {
  if (hours >= 5 && hours < 12) {
    return "this morning"
  }

  if (hours >= 12 && hours < 17) {
    return "this afternoon"
  }

  // 17:00 through 04:59 (wraps past midnight)
  return "this evening"
}

// The visitor's local time is only known in the browser, so render a neutral
// fallback on the server and swap in the local phrase after hydration.
export default function TimeOfDay() {
  const [phrase, setPhrase] = useState("today")

  useEffect(() => {
    setPhrase(getTimeOfDayPhrase(new Date().getHours()))
  }, [])

  return <>{phrase}</>
}
