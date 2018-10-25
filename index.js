const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const url = require('url')
const path = require('path')

// 创建菜单
function buildAppMenu() {

    const template = [{
        label: 'File',
        submenu: [
            { role: 'recentdocuments' },
            { label: 'Open File' },
            { label: 'Open Folder' }
        ]
    }, {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' }
        ]
    }, {
        label: 'Format',
        submenu: [
            {
                label: 'Heading',
                submenu: [
                    { label: 'Heading 1' },
                    { label: 'Heading 2' },
                    { label: 'Heading 3' },
                    { label: 'Heading 4' },
                    { label: 'Heading 5' },
                    { label: 'Heading 6' },
                ]
            },
            { label: 'Bold' },
            { label: 'Italic' },
            { label: 'Delete' },
            { label: 'Quote Block' },
            { label: 'Code Block' },
            { label: 'Inline Code' },
            { label: 'Reference' },
            { label: 'Image' },
        ]
    }, {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    }, {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    }, {
        role: 'help',
        submenu: [
            { label: 'Learn More' }
        ]
    }]

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        })
    }
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

// 创建窗口
function createWindow() {

    win = new BrowserWindow({ width: 800, height: 600 })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    buildAppMenu()
}

app.on('ready', createWindow)
