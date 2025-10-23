import React, { useCallback } from "react"
import { COLORS } from "@/constants/colors"
import { Box, Button, Grid } from "@sanity/ui"
import { PatchEvent, set, StringInputProps, unset } from "sanity"

function ColorPicker(props: StringInputProps) {
  const { value, onChange } = props

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextValue = event.currentTarget.value

      if (value === nextValue) {
        onChange(PatchEvent.from(unset()))
      } else {
        onChange(PatchEvent.from(set(nextValue)))
      }
    },
    [onChange, value]
  )

  return (
    <Box>
      <Grid columns={12} gap={2} aria-label="Tag color">
        {Object.entries(COLORS).map(([colorKey, colorData]) => (
          <Button
            type="button"
            aria-label={colorKey}
            aria-pressed={value === colorKey}
            key={colorKey}
            value={colorKey}
            mode="ghost"
            tone="default"
            radius={2}
            padding={2}
            style={{
              minHeight: 24,
              minWidth: 24,
              aspectRatio: "1/1",
              border:
                value === colorKey
                  ? "2px solid var(--studio-blue-500, #2563eb)"
                  : "1px solid transparent",
            }}
            onClick={handleClick}
          >
            <Box
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colorData,
                borderRadius: 2,
                minHeight: 16,
                minWidth: 16,
                aspectRatio: "1/1",
              }}
            />
          </Button>
        ))}
      </Grid>
    </Box>
  )
}

export default ColorPicker
