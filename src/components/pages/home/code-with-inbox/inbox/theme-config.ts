import {
  NovuIcon,
  NotionIcon,
  LinearIcon,
  NovuEmptyInboxIcon,
  EmptyInboxIcon,
  NotionEmptyInboxIcon,
  LinearEmptyInboxIcon,
  LinearLightEmptyInboxIcon,
} from "./icons"
import type { IconComponent, InboxTheme } from "./types"

// ——— Container THEMES ———

interface IContainerTheme {
  mainBlock: {
    border?: string
    background: string
    gradients?: string[]
    fade?: string
    shine?: string
  }
  header: {
    logo: string
    logoIcon: IconComponent
    logoText?: string
    logoTextClassName?: string
    icon?: string
    notificationIcon?: IconComponent
    messageIcon?: IconComponent
    themeIcon?: IconComponent
    userAvatar?: string
  }
  container: {
    shadow?: string
    background: string
    border?: string
    shine?: string
  }
  background?: {
    gradients: string[]
    image?: string
  }
}

export const CONTAINER_THEMES: Record<InboxTheme, IContainerTheme> = {
  novuDark: {
    mainBlock: {
      border: "bg-[#242528]",
      background: "bg-[#121316]",
    },
    header: {
      logo: "text-[#AFB1B6] ml-3 mr-2.5 size-[18px]",
      logoIcon: NovuIcon,
      logoText: "Novu <Inbox />",
      logoTextClassName: "font-book tracking-tighter text-[#AFB1B6]",
      icon: "text-[#AFB1B6]",
    },
    container: {
      shadow:
        "shadow-[10px_10px_20px_0px_#0F101587,-2px_-2px_10px_0px_#0F101545,0px_-6px_20px_0px_#0000002B]",
      background: "bg-[#1E1F24]",
    },
  },
  novuLight: {
    mainBlock: {
      border: "bg-[#fff]",
      background: "bg-[#F4F4F1]",
    },
    header: {
      logo: "text-[#373530] ml-3 mr-2.5 size-[18px]",
      logoIcon: NovuIcon,
      logoText: "Novu <Inbox />",
      logoTextClassName: "font-book tracking-tighter text-[#373530]",
      icon: "text-[#373530]",
    },
    container: {
      shadow:
        "shadow-[0px_-6.007px_20.025px_0px_rgba(32,41,78,0.05),-2.002px_-2.002px_10.012px_0px_rgba(15,16,21,0.03),10.012px_10.012px_20.025px_0px_rgba(15,16,21,0.05)]",
      background: "bg-white",
    },
  },
  notionDark: {
    mainBlock: {
      border: "bg-[#242528]",
      background: "bg-[#12141A]",
    },
    header: {
      logo: "text-[#AFB1B6] ml-3 mr-2 size-[18px]",
      logoIcon: NotionIcon,
      logoText: "Notion Workspace",
      logoTextClassName:
        "font-normal text-sm leading-none text-[#AFB1B6] -mt-px",
      icon: "text-[#AFB1B6]",
    },
    container: {
      shadow:
        "shadow-[10px_10px_20px_0px_rgba(15,16,21,0.1),-2px_-2px_10px_0px_rgba(15,16,21,0.2),0px_-6px_20px_0px_rgba(15,16,21,0.25)]",
      background: "bg-[#1C1D22]",
    },
  },
  notionLight: {
    background: {
      gradients: [
        "w-[267px] h-[480px] top-[94px] left-[138px] blur-[22px] rounded-full rotate-[7deg] bg-[radial-gradient(50%_50%_at_50%_50%,#314479_0%,rgba(49,68,121,0)_100%)]",
        "w-[510px] h-[648px] -top-10 -right-8 rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#1C2D5E_0%,rgba(18,28,59,0)_100%)]",
        "w-[510px] h-[648px] top-2.5 left-8 rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#1C2D5E_0%,rgba(18,28,59,0)_100%)]",
        "w-[884px] h-[1090px] top-[-250px] left-[-130px] rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#121C3B_16.51%,rgba(18,28,59,0)_100%)]",
      ],
    },
    mainBlock: {
      background:
        "bg-[#F7F7F5] shadow-[0px_3px_20px_0px_rgba(8,9,12,0.12)_inset]",
    },
    header: {
      logo: "text-[#373530] ml-3 mr-2",
      logoIcon: NotionIcon,
      logoText: "Notion Workspace",
      logoTextClassName:
        "font-normal text-sm leading-none text-[#373530] -mt-px",
      icon: "text-[#373530]",
    },
    container: {
      shadow:
        "shadow-[10px_10px_20px_0px_rgba(15,16,21,0.05),-2px_-2px_10px_0px_rgba(15,16,21,0.07),0px_-6px_20px_0px_rgba(15,16,21,0.03)]",
      background: "bg-[#FFFFFF]",
    },
  },
  linearDark: {
    background: {
      gradients: [
        "w-[267px] h-[480px] top-[94px] left-[138px] blur-[22px] rounded-full rotate-[7deg] bg-[radial-gradient(50%_50%_at_50%_50%,#314479_0%,rgba(49,68,121,0)_100%)]",
        "w-[510px] h-[648px] -top-10 -right-8 rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#121C3B_16.51%,rgba(18,28,59,0)_100%)]",
        "w-[510px] h-[648px] top-2.5 left-8 rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#121C3B_16.51%,rgba(18,28,59,0)_100%)]",
        "w-[884px] h-[1090px] top-[-250px] left-[-130px] rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#121C3B_16.51%,rgba(18,28,59,0)_100%)]",
      ],
    },
    mainBlock: {
      background: "bg-[#15161C]",
      border: "border border-[#2C2E3A]",
    },
    header: {
      logo: "text-[#9A9AA1] ml-3 mr-2 w-[72px] h-[18px]",
      logoIcon: LinearIcon,
    },
    container: {
      background: "bg-[#191A22]",
      border: "border border-[#2C2E3A]",
    },
  },
  linearLight: {
    background: {
      gradients: [
        "w-[267px] h-[480px] top-[94px] left-[138px] blur-[22px] rounded-full rotate-[7deg] bg-[radial-gradient(50%_50%_at_50%_50%,#314479_0%,rgba(49,68,121,0)_100%)]",
        "w-[510px] h-[648px] -top-10 -right-8 rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#1C2D5E_0%,rgba(18,28,59,0.00)_100%)]",
        "w-[510px] h-[648px] top-2.5 left-8 rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#1C2D5E_0%,rgba(18,28,59,0.00)_100%)]",
        "w-[884px] h-[1090px] top-[-250px] left-[-130px] rounded-full rotate-[52deg] bg-[radial-gradient(50%_50%_at_50%_50%,#121C3B_52%,rgba(18,28,59,0.00)_100%)]",
      ],
    },
    mainBlock: {
      background: "bg-[#EDEDED]",
    },
    header: {
      logo: "text-[#222326] ml-3 mr-2 w-[72px] h-[18px]",
      logoIcon: LinearIcon,
    },
    container: {
      background:
        "bg-white shadow-[0px_-6px_20px_0px_rgba(15,16,21,0.02),-2px_-2px_10px_0px_rgba(15,16,21,0.02),10px_10px_20px_0px_rgba(15,16,21,0.03)]",
    },
  },
}

// ——— Message list THEMES ———

interface IMessageListTheme {
  text: string
  emptyInboxIcon: {
    Component: IconComponent
    className: string
  }
}

export const MESSAGE_LIST_THEMES: Record<InboxTheme, IMessageListTheme> = {
  novuDark: {
    text: "text-[#9498B1]",
    emptyInboxIcon: {
      Component: NovuEmptyInboxIcon,
      className: "size-[34px] text-[#9498B1]",
    },
  },
  novuLight: {
    text: "text-[#646464]",
    emptyInboxIcon: {
      Component: EmptyInboxIcon,
      className: "size-[34px] text-[#646464]",
    },
  },
  notionDark: {
    text: "text-[#6F727B]",
    emptyInboxIcon: {
      Component: NotionEmptyInboxIcon,
      className: "size-12 text-[#6F727B]",
    },
  },
  notionLight: {
    text: "text-[#D8D5D5]",
    emptyInboxIcon: {
      Component: NotionEmptyInboxIcon,
      className: "size-12 text-[#D8D5D5]",
    },
  },
  linearDark: {
    text: "text-[#9A9AA1]",
    emptyInboxIcon: {
      Component: LinearEmptyInboxIcon,
      className: "size-12 text-[#D8D5D5]",
    },
  },
  linearLight: {
    text: "text-[#5D5D5E]",
    emptyInboxIcon: {
      Component: LinearLightEmptyInboxIcon,
      className: "size-12",
    },
  },
}

// ——— Novu message THEMES ———

export const NOVU_MESSAGE_THEMES = {
  novuDark: {
    avatar: "text-[#D2D7E1] bg-[#464953]",
    dot: "bg-[#7D52F4]",
    border: "border-[#505462]/30",
    background:
      "hover:bg-[#18191D] has-[:focus-visible]:bg-[#18191D]",
    secondaryButton:
      "text-[#ABABBA] hover:bg-[#131313] bg-[#FFFFFF0A] focus-visible:shadow-[0px_0px_0px_1px_#545862,0px_0px_0px_4px_rgba(153,160,174,0.16)]",
    secondaryButtonBorder:
      "group/button:hover:border-[#B0B0B01F] border-[#40434C]",
    titleStyles: "text-[#FFFFFF]",
    textStyles: "text-[#9599AD]",
    dateStyles: "text-[#B9BCCF]",
  },
  novuLight: {
    avatar: "text-[#778092] bg-[#E6E6E3]",
    dot: "bg-[#7D52F4]",
    border: "border-[#E7E7E7]",
    background:
      "hover:bg-[#F7F7F5] has-[:focus-visible]:bg-[#F7F7F5]",
    secondaryButton:
      "text-[#5C5C70] shadow-[0px_0px_0px_0.5px_#E1E4EA] bg-white hover:bg-[#F2F2F2] focus-visible:shadow-[0px_0px_0px_4px_rgba(153,160,174,0.16)]",
    secondaryButtonBorder: "border-[#B0B0B01F]",
    titleStyles: "text-[#22242A]",
    textStyles: "text-[#646464]",
    dateStyles: "text-[#646464]",
  },
} as const

// ——— Notion message THEMES ———

export const NOTION_MESSAGE_THEMES = {
  notionDark: {
    dot: "bg-[#4B73EC]",
    border: "after:bg-[#242528]",
    background:
      "hover:bg-[#292B32] focus-within:bg-[#292B32] has-[:focus-visible]:bg-[#292B32]",
    action:
      "text-[#6F727B] hover:bg-[#40434E] focus-visible:bg-[#40434E]",
    actionContainer: "",
    avatarBorder: "border-[#6F727B]",
    text: "text-[#FFFFFF]",
    icons: "text-[#6F727B]",
    fileBorder: "after:bg-[#6F727B]",
    authorText: "text-[#6F727B]",
    buttonBorder: "border-[#6F727B]",
  },
  notionLight: {
    dot: "bg-[#4B73EC]",
    border: "after:bg-[#F1F0F0]",
    background:
      "hover:bg-[#F7F7F7] focus-within:bg-[#F7F7F7] has-[:focus-visible]:bg-[#F7F7F7]",
    action:
      "text-[#91918E] hover:bg-[#F0F0F0] focus-visible:bg-[#F0F0F0]",
    actionContainer: "bg-[#FFFFFF] border border-[#E7E7E7]",
    avatarBorder: "border-[rgba(125,124,124,0.1)]",
    text: "text-[#373530]",
    icons: "text-[#B4B4B1]",
    fileBorder: "after:bg-[#E7E7E7]",
    authorText: "text-[#91918E]",
    buttonBorder: "border-[#E7E7E7]",
  },
} as const

// ——— Linear message THEMES ———

export const LINEAR_MESSAGE_THEMES = {
  linearDark: {
    dot: "bg-[#4B73EC]",
    messageItemHover: "hover:bg-[#1C1D27]",
    avatarIconBg: "text-[#191A22]",
    headerUnread: "text-white font-medium",
    textUnread: "text-[#9A9AA1]",
    headerRead: "text-[#73747B]",
    textRead: "text-[#73747B]",
  },
  linearLight: {
    dot: "bg-[#4B73EC]",
    messageItemHover: "hover:bg-[#F8F8F8]",
    avatarIconBg: "text-white",
    headerUnread: "text-[#303031] font-medium",
    textUnread: "text-[#5D5D5E]",
    headerRead: "text-[#7D7D7D]",
    textRead: "text-[#7D7D7D]",
  },
} as const

// ——— Novu header THEMES ———

export const NOVU_HEADER_THEMES = {
  novuDark: {
    titleColor: "text-[#FFFFFF]",
    mainIconsColor: "text-[#9498B1]",
    menuStyles:
      "bg-[#24262C] shadow-[0px_4px_12px_0px_rgba(19,22,29,0.4)]",
    menuItemStyles: "text-[#FFFFFF] hover:bg-[#313339]",
  },
  novuLight: {
    titleColor: "text-[#22242A]",
    mainIconsColor: "text-[#999999]",
    menuStyles:
      "bg-[#FFFFFF] shadow-[0px_4px_20px_0px_rgba(19,22,29,0.1)] border border-[#E3E0E0]",
    menuItemStyles: "text-[#373530] hover:bg-[#F7F7F5]",
  },
} as const

// ——— Notion header THEMES ———

export const NOTION_HEADER_THEMES = {
  notionDark: {
    titleColor: "text-[#FFFFFF]",
    mainIconsColor: "text-[#6F727B]",
    menuStyles:
      "bg-[#292B32] shadow-[0px_4px_12px_0px_rgba(19,22,29,0.4)]",
    menuItemStyles: "text-[#FFFFFF] hover:bg-[#40434E]",
  },
  notionLight: {
    titleColor: "text-[#373530]",
    mainIconsColor: "text-[#A5A4A1]",
    menuStyles:
      "bg-[#FFFFFF] shadow-[0px_4px_20px_0px_rgba(19,22,29,0.1)] border border-[#E7E7E7]",
    menuItemStyles: "text-[#373530] hover:bg-[#F0F0F0]",
  },
} as const

// ——— Linear header THEMES ———

export const LINEAR_HEADER_THEMES = {
  linearDark: {
    titleColor: "text-white",
    moreIconsColor: "text-[#A5A4A1]",
    settingsIconColor: "text-[#A5A4A1]",
    mainIconsUnderlayStyles: "hover:bg-[#21222B]",
    menuStyles:
      "bg-[#23242E] shadow-[0px_4px_8px_0px_rgba(19,22,29,0.60)] border border-[#373847]",
    menuItemStyles:
      "text-[#E5E6EF] hover:bg-[#343543] hover:text-white",
    menuSeparatorStyles: "bg-[#373847]",
    orderingMenuStyles:
      "bg-[#23242E] text-[#9A9AA1] shadow-[0px_4px_8px_0px_rgba(19,22,29,0.60)] border border-[#373847]",
    orderingDropdownStyles:
      "border border-[#373847] bg-[#303140] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.10)] text-white",
    orderingDropdownBtnStyles:
      "border border-[#373847] bg-[#303140] text-[#E5E6EF]",
    orderingDropdownIconStyles: "text-white",
    toggleOnBgColor: "bg-[#4B73EC]",
    toggleOffBgColor: "bg-[#73737A]",
    menuIconStyles: "text-[#9F9FA7] group-hover/item:text-white",
    headerSeparator: "bg-[#2C2E3A]",
  },
  linearLight: {
    titleColor: "text-[#1B1B1B]",
    moreIconsColor: "text-[#1B1B1B]",
    settingsIconColor: "text-[#5D5D5E]",
    mainIconsUnderlayStyles: "hover:bg-[#F1F1F1] hover:text-white",
    menuStyles:
      "bg-white shadow-[0px_4px_10px_0px_rgba(53,53,53,0.15),_0px_1px_2px_0px_rgba(53,53,53,0.20)] border border-[#DCDCDC]",
    menuItemStyles:
      "text-[#303031] hover:bg-[#F3F3F3] hover:text-[#1B1B1B]",
    menuSeparatorStyles: "bg-[#E4E4E4]",
    menuIconStyles:
      "text-[#5E5E60] group-hover/item:text-[#1B1B1B]",
    orderingMenuStyles:
      "bg-[#Ffffff] text-[#5D5D5E] shadow-[0px_4px_10px_0px_rgba(53,53,53,0.15),_0px_1px_2px_0px_rgba(53,53,53,0.20)] border border-[#E4E4E4]",
    orderingDropdownStyles:
      "bg-[#ffffff] border border-[#E4E4E4] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.10)] text-[#303031]",
    orderingDropdownBtnStyles:
      "border bg-white border-[#D8D8D8] text-[#1B1B1B]",
    orderingDropdownIconStyles: "text-[#5E5E60]",
    toggleOnBgColor: "bg-[#4B73EC]",
    toggleOffBgColor: "bg-[#CDCDCD]",
    headerSeparator: "bg-[#DCDCDC]",
  },
} as const

// ——— Novu tab list THEMES ———

export const NOVU_TAB_LIST_THEMES = {
  novuDark: {
    border: "bg-[#313339]",
    borderActive: "bg-[#8760F5]",
    activeTabStyles: "text-white",
    tabStyles: "text-[#8E96A5]",
    badge: "text-white bg-[#FB3748]",
  },
  novuLight: {
    border: "bg-[#E7E7E7]",
    borderActive: "bg-[#8760F5]",
    activeTabStyles: "text-black",
    tabStyles: "text-[#646464]",
    badge: "text-white bg-[#FB3748]",
  },
} as const
