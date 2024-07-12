const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
 
let mainWindow;
 
 
 
function createWindow() {
 
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true,
        maximizable: false,
        fullscreenable: false,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../build', 'index.html'));
   /*mainWindow.loadURL('http://localhost:3000')*/
}
 
 

app.whenReady().then(() => {
 
    createWindow();
 
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
 

    if (process.platform !== 'darwin') app.quit();
});