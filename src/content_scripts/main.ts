import type Subject from '../models/Subject';

console.log('hello from content script');

const selectors = [
    '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_1 .gpv-pred',
    '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_2 .gpv-pred',
    '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_3 .gpv-pred',
]

const fetchSubjects = (): Subject[][] => {
    const subjects: Subject[][] = [];
    for(let i in selectors) {
        let elements = document.querySelectorAll(selectors[i]);
        const yearSubjects = []
        for(let el of Array.from(elements)) {
            const textRaw = (el as HTMLElement).innerText;
            const text = textRaw.replace(/\\n|[\s\n]|\d$/g, '');
            yearSubjects.push({
                title: text,
                id: text.normalize('NFKC').toLowerCase(),
                year: Number(i) + 1
            })
        }
        if(yearSubjects.length > 0)
            subjects.push(yearSubjects);
    }
    return subjects;
}

chrome.runtime.onMessage.addListener((msg, s, sendResponse) => {
    console.log(msg);
    switch(msg.action) {
        case 'fetch_subjects':
            const res = fetchSubjects();
            console.log(res);
            setTimeout(() => sendResponse(res), 10);
            break;
    }
})