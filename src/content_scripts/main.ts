import type { SubjectTime } from '../models/Timetable';
import { clearInnerText, normalizeText, sleep, timeToMinutes } from '../helper';
import type Subject from '../models/Subject';
import type Plan from '../models/Plan';
import type { SubjectEvent } from '../models/Plan';
import type Timetable from '../models/Timetable';
import type Message from '../models/Message';

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

type SubjectCell = {
    subjectId: string,
    time: SubjectTime,
    elementRef: HTMLElement
}
type SubjectsPlan = SubjectCell[][];
type SubjectQueue = {
    id: string,
    selected: boolean,
    events: SubjectEvent[]
}[]


const onLoad = async () => {
    if(localStorage == null) return;
    const settings = JSON.parse(localStorage.getItem('stag_manager_settings'));
    const storedQueue = localStorage.getItem('subject_queue');
    const timetable: Timetable = JSON.parse(localStorage.getItem('timetable_template'));
    if(settings == null || storedQueue == null || timetable == null) return;
    const queue: SubjectQueue = JSON.parse(storedQueue);
    if(queue[0] == null) {sendMessage('info', 'reached end of the task'); return};

    //select the subjects
    for(let i in queue) {
        if(!queue[i].selected){
            //mark as selected
            queue[i].selected = true;
            localStorage.setItem('subject_queue', JSON.stringify(queue));
            const gotSelected = selectSubject(queue[i].events[0].subject, settings);

            if(!gotSelected) {
                sendMessage('error' ,`couldn't select subject: ${queue[i].events[0].subject.title}`);
            }
            await sleep(500);
        }
    }

    //enroll in subjects
    const newQueue = queue.slice()
    for(const currSubj of queue) {
        //delete from queue
        newQueue.shift();
        localStorage.setItem('subject_queue', JSON.stringify(newQueue));

        for(const event of currSubj.events) {
            const times = timetable[event.time];
            const stagSubjectEvents = getSubjectsFormated(settings);

            const filteredSubjects = stagSubjectEvents[event.day]?.filter((subj) => subjectsOverlap(subj.time, times));
            if(!filteredSubjects || filteredSubjects.length < 1) {
                sendMessage('error', `subject not found in the timetable: ${event.subject.title}`);
                continue;
            };

            for(let subj of filteredSubjects) {
                if(subj.elementRef.isConnected && subj.subjectId.includes(event.subject.id)) {
                    const selectBtn: HTMLElement = getSubjectButtonElement(subj.elementRef, settings);
                    if(selectBtn && selectBtn.isConnected){
                        selectBtn.click();
                        await sleep(200);
                    }
                }
            }
        }
    }

    save(settings);

    function subjectsOverlap(timeA: SubjectTime, timeB: SubjectTime) {
        let maxA = Math.max(timeA[0], timeB[0]);
        let minB = Math.min(timeA[1], timeB[1]);
        let diff = minB - maxA;
        let length1 = timeB[1] - timeB[0];
        let length2 = timeA[1] - timeA[0];
        return diff > Math.min(length1, length2) / 2;
    }
}


const enroll = (plan: Plan, settings) => {
    sendMessage('info', 'start of the task');

    //group events by the subject id
    const groupByKey: {[key: string]: SubjectEvent[]} = {};
    for(let event of plan.events) {
        if(groupByKey[event.subject.id] == null)
            groupByKey[event.subject.id] = [event];
        else
            groupByKey[event.subject.id].push(event);
    }
    //create a queue for the subjects
    const subjectQueue: SubjectQueue = [];
    for(const [key, value] of Object.entries(groupByKey)) {
        subjectQueue.push({
            id: key,
            selected: false,
            events: value
        })
    }

    if(localStorage){
        //save the queue
        localStorage.setItem('subject_queue', JSON.stringify(subjectQueue));
        //save the timetable in the plan
        localStorage.setItem('timetable_template', JSON.stringify(plan.timetable));
        //save the settings
        localStorage.setItem('stag_manager_settings', JSON.stringify(settings));

        onLoad();
    }
}

const selectSubject = (subject: Subject, settings) => {
    const selectors = settings.subjects_by_year_selectors;
    const mergeSelectors = settings.subjects_by_year_selectors.join(', ');

    const firstList = Array.from(document.querySelectorAll(selectors[subject.year - 1]));
    const allSubjectsList = Array.from(document.querySelectorAll(mergeSelectors));
    const subjectList: HTMLElement[] = firstList.concat(allSubjectsList);
    const matchingSubjectList = subjectList.filter((el) => {
        const text = normalizeText(clearInnerText(el.innerText));
        return text.includes(subject.id);
    })

    for(let el of matchingSubjectList) {
        const clickableArea: HTMLElement = el.querySelector('td, *');
        clickableArea.click();
        const selectBtn: HTMLElement = document.querySelector(settings.subject_select_button_selector);
        //select subject if possible
        if(selectBtn) {
            selectBtn.click();
            return true;
        }
    }
    return false;
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

const save = (settings) => {
    const saveBtn: HTMLElement = document.querySelector(settings.confirm_button_selector);
    saveBtn?.click();
}

const getSubjectTitleElement = (cell: HTMLElement, settings) => {
    const title: HTMLElement = cell.querySelector(settings.cell_subject_title_selector);
    return title;
}
const getSubjectButtonElement = (cell: HTMLElement, settings) => {
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

const sendMessage = (type: Message["type"], text: string) => {
    const message = {type, text};
    chrome.runtime.sendMessage({type: 'new_message', data: message});
}

onLoad();

chrome.runtime.onMessage.addListener((msg, s, sendResponse) => {
    switch(msg.action) {
        case 'fetch_subjects':
            const res = fetchSubjects(msg.data.settings);
            sendResponse(res);
            break;
        case 'enroll_in_subjects':
            enroll(msg.data.plan, msg.data.settings);
            sendResponse('good');
            break;
    }
})