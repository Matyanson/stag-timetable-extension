import { clearInnerText, normalizeText } from '../helper';
import type Subject from '../models/Subject';

console.log('hello from content script');

const selectors = [
    '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_1 .gpv-pred',
    '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_2 .gpv-pred',
    '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_3 .gpv-pred',
    '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_4 .gpv-pred',
]

const fetchSubjects = (): Subject[] => {
    const subjects: Subject[] = [];
    for(let i in selectors) {
        let elements = document.querySelectorAll(selectors[i]);
        for(let el of Array.from(elements)) {
            const textRaw = (el as HTMLElement).innerText;
            const text = clearInnerText(textRaw).replace(/\d$/g, '');
            subjects.push({
                title: text,
                id: normalizeText(text),
                year: Number(i) + 1
            })
        }
    }
    return subjects;
}

chrome.runtime.onMessage.addListener((msg, s, sendResponse) => {
    console.log(msg);
    switch(msg.action) {
        case 'fetch_subjects':
            const res = fetchSubjects();
            sendResponse(res);
            break;
    }
})