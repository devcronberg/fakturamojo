function logEnabled() {
    return true;
}

function logTimePrefix() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').replace('Z', '') + '.' + now.getMilliseconds().toString().padStart(3, '0');
}

export function groupStart(title) {
    if (!logEnabled()) return;
    if (title) {
        console.groupCollapsed(`[${logTimePrefix()}] ${title}`);
    }
}

export function groupEnd() {
    if (!logEnabled()) return;
    console.groupEnd();
}

export function logError(message) {
    if (!logEnabled()) return;
    console.error(`[${logTimePrefix()}]`, message);
}

export function logInfo(message, title = null) {
    if (!logEnabled()) return;
    if (title) {
        console.info(`[${logTimePrefix()}] ${title}:`, message);
    } else {
        console.info(`[${logTimePrefix()}]`, message);
    }
}