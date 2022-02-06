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

const getSubjectsFormated = (settings): SubjectsPlan => {
    const table: HTMLElement = document.querySelector(settings.timetable_selector);
    const times = getTableTimes(table);
    const rows = Array.from(table.querySelectorAll('tr')).slice(1);
    const timesFiltered = times.filter(x => x.time !== null);
    const timesFilteredReversed = timesFiltered.slice().reverse();

    const res: SubjectsPlan = [];
    let dayRowSpan = 0;
    let daySubjects = [];

    for(let row of rows) {
        let colSpanSum = 0;
        const cells = Array.from(row.querySelectorAll('td'));
        dayRowSpan = dayRowSpan == 0 ? (cells[0].rowSpan ?? 1) : dayRowSpan;  //get how many rows is this day wide
        
        for(let cell of cells) {
            const subj = getSubjectEvent(cell, colSpanSum);

            if(subj) daySubjects.push(subj);
            colSpanSum += cell.colSpan;
        }

        dayRowSpan--;
        if(dayRowSpan == 0) {   //reached end of the day -> reset
            res.push(daySubjects);
            daySubjects = [];
        }
    }

    function getSubjectEvent(cell: HTMLTableCellElement, colSpanSum: number): SubjectCell {
        const titleEl = getSubjectTitleElement(cell, settings);
        if(titleEl == null) return null;

        const start = timesFiltered.find(x => x.colSpanEnd > colSpanSum)
        ?? timesFiltered[timesFiltered.length - 1];
        const end = timesFilteredReversed.find(x => x.colSpanStart < colSpanSum + cell.colSpan)
        ?? timesFilteredReversed[timesFilteredReversed.length - 1];

        return {
            elementRef: cell,
            time: [start.time[0], end.time[1]],
            subjectId: normalizeText(clearInnerText(titleEl.innerText))
        }
    }
    return res;
}

const getSubjectTitleElement = (cell: HTMLTableCellElement, settings) => {
    const title: HTMLElement = cell.querySelector(settings.cell_subject_title_selector);
    return title;
}
const getSubjectButtonElement = (cell: HTMLTableCellElement, settings) => {
    const button = cell.querySelector(settings.cell_subject_button_selector);
    return button;
}

const getTableTimes = (table: HTMLElement) => {
    const header = table.querySelector('tr');
    const headerCells =  header.querySelectorAll('td, th');

    const res: {
        time: SubjectTime,
        colSpanStart: number
        colSpanEnd: number
    }[] = [];

    let colSpanSum = 0;
    for(let i in Array.from(headerCells)) {
        const cell = (headerCells[i] as HTMLTableCellElement);
        const textRaw = cell.innerText;
        const times = clearInnerText(textRaw).match(/\d{1,2}:\d{2}/g);
        const colSpanVals = {
            colSpanStart: colSpanSum,
            colSpanEnd: colSpanSum + cell.colSpan
        }

        if(times == null) {
            res.push({
                time: null,
                ...colSpanVals
            });
            colSpanSum += cell.colSpan;
            continue;
        }


        const startTime = times[0];
        const endTime = times[times.length - 1];
        res.push({
            ...colSpanVals,
            time:[
                timeToMinutes(startTime),
                timeToMinutes(endTime)
            ]
        });
        colSpanSum += cell.colSpan;
    }
    return res;
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