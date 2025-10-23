import React from "react"
import { COLORS } from "@/constants/colors"
import { Box } from "@sanity/ui"

interface ChangeItemPreviewProps {
  color?: keyof typeof COLORS
}

export const ChangeItemPreview = ({ color }: ChangeItemPreviewProps) => {
  return (
    <Box
      style={{
        width: 16,
        height: 16,
        backgroundColor: color
          ? COLORS[color as keyof typeof COLORS]
          : "transparent",
      }}
    />
  )
}
