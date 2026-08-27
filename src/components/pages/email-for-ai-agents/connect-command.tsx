import { cn } from "@/lib/utils"
import { CopyCommand } from "@/components/ui/copy-command"

function ConnectCommand({
  command,
  className,
}: {
  command: string
  className?: string
}) {
  return (
    <CopyCommand
      className={cn("min-w-0", className)}
      command={command}
      controlClassName="h-11 border-gray-30 bg-black pl-3.75 lg:h-11"
      commandClassName="text-base leading-none tracking-tighter text-white"
      copyButtonClassName="size-11 text-gray-70 lg:size-11 [&_svg]:size-4"
    />
  )
}

export default ConnectCommand
