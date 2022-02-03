export const clearInnerText = (rawText: string) => {
    return rawText.replace(/\\n|[\s\n]/g, '');
}

export const normalizeText = (text: string) => {
    return text.normalize('NFKC').toLowerCase();
}