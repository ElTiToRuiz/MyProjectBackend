async function loadApp() {
    const {app} = await import('./server.js');
}

loadApp();

