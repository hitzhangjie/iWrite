// 构建鼠标上下文菜单
function buildContextMenu() {

    const { remote } = require('electron')
    const { Menu, MenuItem } = remote

    const menu = new Menu()

    // Build menu one item at a time, unlike
    menu.append(new MenuItem({
        label: 'MenuItem1',
        click() {
            console.log('item 1 clicked')
        }
    }))

    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
    menu.append(new MenuItem({
        label: 'MenuItem3',
        click() {
            console.log('item 3 clicked')
        }
    }))

    // Prevent default action of right click in chromium. Replace with our menu.
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        menu.popup(remote.getCurrentWindow())
    }, false)
}

// 构建托盘按钮上下文菜单
function buildTrayMenu() {
    const { remote } = require('electron')
    const { Tray, Menu } = remote
    const path = require('path')

    let trayIcon = new Tray(path.join('', '/Users/zhangjie/Downloads/iWrite.png'))

    const trayMenuTemplate = [
        {
            label: 'Empty Application',
            enabled: false
        },

        {
            label: 'Settings',
            click: function () {
                console.log("Clicked on settings")
            }
        },

        {
            label: 'Help',
            click: function () {
                console.log("Clicked on Help")
            }
        }
    ]

    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
    trayIcon.setContextMenu(trayMenu)
}

// 注册通知回调函数
function registerNotifyHandler() {
    const notifier = require('node-notifier')
    const path = require('path');

    document.getElementById('notify').onclick = (event) => {
        notifier.notify({
            title: 'My awesome title',
            message: 'Hello from electron, Mr. User!',
            icon: path.join('', '/Users/zhangjie/Downloads/iWrite.png'),  // Absolute path (doesn't work on balloons)
            sound: true,  // Only Notification Center or Windows Toasters
            wait: true    // Wait with callback, until user action is taken against notification

        }, function (err, response) {
            // Response is response from notification
        });

        notifier.on('click', function (notifierObject, options) {
            console.log("You clicked on the notification")
        });

        notifier.on('timeout', function (notifierObject, options) {
            console.log("Notification timed out!")
        });
    }

}

// 启动markdown渲染
function loadMarkdownPreview() {
    onload = () => {
        const webview = document.getElementById('markdown-preview')
        const indicator = document.querySelector('.indicator')

        const loadstart = () => {
            indicator.innerText = 'loading...'
        }

        const loadstop = () => {
            indicator.innerText = ''
        }

        webview.addEventListener('did-start-loading', loadstart)
        webview.addEventListener('did-stop-loading', loadstop)
    }
}

// 给主进程发送消息
function registerOpenFileHandler() {

    const { ipcRenderer } = require('electron')

    // Async message handler
    ipcRenderer.on('filedata', (event, data) => {
        console.log(data)
        //alert("file data is: \n" + data)
    })

    document.getElementById('openfile').onclick = (event) => {
        // Async message sender
        ipcRenderer.send('openfile', 'please show the dialog for select file')
        console.log('send openfile message to ipcMain')
    }
}

function openFileKeyBinding() {
    const { ipcRenderer, remote } = require('electron')
    const { globalShortcut } = remote
    globalShortcut.register('CommandOrControl+O', () => {
        ipcRenderer.send('openfile', () => {
            console.log("Event sent.");
        })

        ipcRenderer.on('filedata', (event, data) => {
            //document.write(data)
            //alert('file raw data is:\n' + data)
            console.log(parseMarkdownText(data))
            //alert('file rendered data is:\n' + parseMarkdownText(data))
            document.getElementById('markdown-doc-raw').innerHTML = data
            document.getElementById('markdown-doc-render').innerHTML = parseMarkdownText(data)
        })
    })
}

function parseMarkdownText(filedata) {

    var MarkdownIt = require('markdown-it');
    var md = new MarkdownIt();
    return md.render(filedata)
}
