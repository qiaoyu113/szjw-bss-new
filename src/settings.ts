interface ISettings {
  title: string // Overrides the default title
  showSettings: boolean // Controls settings panel display
  showTagsView: boolean // Controls tagsview display
  showSidebarLogo: boolean // Controls siderbar logo display
  fixedHeader: boolean // If true, will fix the header component
  openNew: boolean // If true, will open new window in your Browser
  isPC: boolean // judge preview window is pc or other
  tableHeight: number // table max-height
  errorLog: string[] // The env to enable the errorlog component, default 'production' only
  sidebarTextTheme: boolean // If true, will change active text color for sidebar based on theme
  devServerPort: number // Port number for webpack-dev-server
  mockServerPort: number // Port number for mock server
}

// You can customize below settings :)
const settings: ISettings = {
  title: '云鸟梧桐综合业务支撑平台',
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showSidebarLogo: true,
  openNew: false,
  isPC: true,
  tableHeight: 0,
  errorLog: ['production'],
  sidebarTextTheme: false,
  devServerPort: 9527,
  mockServerPort: 9528
}

export default settings

export const delayTime:number = 1500
