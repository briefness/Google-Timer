const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 500,
    frame: false,           // 无边框，更沉浸
    transparent: false,
    resizable: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 关键：设置为 screen-saver 级别，压过全屏 PPT
  win.setAlwaysOnTop(true, 'screen-saver')

  // 关键：在所有工作区/Space 可见（包括 PPT 全屏的独占 Space）
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  // 加载你现有的 index.html
  win.loadFile(path.join(__dirname, 'index.html'))

  // 按 Esc 退出应用
  globalShortcut.register('Escape', () => {
    app.quit()
  })

  // 按 F11 切换全屏
  globalShortcut.register('F11', () => {
    win.setFullScreen(!win.isFullScreen())
  })

  // 按 Ctrl/Cmd+M 切换置顶（方便临时取消）
  globalShortcut.register('CommandOrControl+M', () => {
    const isOnTop = win.isAlwaysOnTop()
    win.setAlwaysOnTop(!isOnTop, 'screen-saver')
    console.log(`Always on top: ${!isOnTop}`)
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
