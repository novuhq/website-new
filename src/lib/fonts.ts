import localFont from "next/font/local"

export const brother1816 = localFont({
  src: [
    {
      path: "../../public/fonts/brother-1816/brother-1816-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/brother-1816/brother-1816-book.woff2",
      weight: "350",
      style: "normal",
    },
    {
      path: "../../public/fonts/brother-1816/brother-1816-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/brother-1816/brother-1816-medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-brother-1816",
})
