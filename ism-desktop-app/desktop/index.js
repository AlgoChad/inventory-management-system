const { initRemix } = require("remix-electron")
const { app, BrowserWindow, dialog, ipcMain } = require("electron")
const path = require("node:path")

/** @type {BrowserWindow | undefined} */
let win

/** @param {string} url */
async function createWindow(url) {
	win = new BrowserWindow({ 
        show: false,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
     });
     
    win.setMenuBarVisibility(false);
	await win.loadURL(url);
    ipcMain.on('minimize-window', () => {
        if (win) {
            win.minimize();
        }
    });

    ipcMain.on('maximize-window', () => {
        if (win && win.isMaximized()) {
            win.unmaximize();
        } else {
            win && win.maximize();
        }
    });

    ipcMain.on('close-window', () => {
        if (win) {
            win.close();
        }
    });
	win.show();
}

app.on("ready", () => {
	void (async () => {
		try {
			if (process.env.NODE_ENV === "development") {
				const {
					default: installExtension,
					REACT_DEVELOPER_TOOLS,
				} = require("electron-devtools-installer");

				await installExtension(REACT_DEVELOPER_TOOLS);
			}

			const url = await initRemix({
				serverBuild: path.join(__dirname, "../build/index.js"),
			});
			await createWindow(url);
		} catch (error) {
			dialog.showErrorBox("Error", getErrorStack(error));
			console.error(error);
		}
	})()
})

/** @param {unknown} error */
function getErrorStack(error) {
	return error instanceof Error ? error.stack || error.message : String(error)
}
