export const clearInnerText = (rawText: string) => {
    return rawText.replace(/\\n|[\s\n]/g, '');
}

export const normalizeText = (text: string) => {
    return text.normalize('NFKC').toLowerCase();
}

export const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':');
    return Number(hours) * 60 + Number(minutes);
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));