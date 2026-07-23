export const HOME_FEATURES_SECTION_ID = "communication-channels"
export const HOME_CHANNEL_SELECT_EVENT = "home:select-channel"

export interface IHomeChannelSelectDetail {
  key: string
  /** focus the notify-me email input after the channel is selected */
  focusNotify?: boolean
}
