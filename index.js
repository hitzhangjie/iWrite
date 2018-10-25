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

function handleOpenFileEvt() {

    const { ipcMain } = require('electron')
    const { dialog } = require('electron')
    const fs = require('fs')

    ipcMain.on('openfile', (event, path) => {

        dialog.showOpenDialog(function (fileNames) {
            // fileNames is an array that contains all the selected
            if (fileNames === undefined)
                console.log("No file selected")
            else
                readFile(fileNames[0])
        })

        function readFile(filepath) {
            fs.readFile(filepath, 'utf-8', (err, data) => {
                if (err) {
                    alert("An error ocurred reading the file :" + err.message)
                    return
                }
                // handle the file content
                event.sender.send('filedata', data)
            })
        }
    })

    console.log("hello world")
}

// 创建窗口
function createWindow() {

    win = new BrowserWindow({
        backgroundColor: '#1c212e',
        width: 1024,
        height: 1024,
        //frame: false,
        //titleBarStyle: 'hiddenInset',
        transparent: true,
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    buildAppMenu()
    handleOpenFileEvt()
}

app.on('ready', createWindow)
