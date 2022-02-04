import { clearInnerText, normalizeText } from '../helper';
import type Subject from '../models/Subject';

const fetchSubjects = (settings): Subject[] => {
    const selectors = settings.subjects_by_year_selectors;
    const subjects: Subject[] = [];
    for(let i in selectors) {
        let elements = document.querySelectorAll(selectors[i]);
        for(let el of Array.from(elements)) {
            const textRaw = (el as HTMLElement).innerText;
            let re = new RegExp(settings.subject_text_filter,'g');
            const text = clearInnerText(textRaw).replace(re, '');
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
            const res = fetchSubjects(msg.data.settings);
            sendResponse(res);
            break;
    }
})