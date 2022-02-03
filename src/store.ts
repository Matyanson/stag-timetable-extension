import { writable, Writable } from "svelte/store";
import type Plan from "./models/Plan";
import type Subject from "./models/Subject";
import type Timetable from "./models/Timetable";

const wStorage = <T>(key: string, initValue: T): Writable<T> => {
    const store = writable(initValue);
    if (typeof Storage === 'undefined') return store;

    const storedValueStr = localStorage.getItem(key);
    if (storedValueStr != null) store.set(JSON.parse(storedValueStr));

    store.subscribe((val) => {
        localStorage.setItem(key, JSON.stringify(val));
    })
    return store;
}

export const subjects = wStorage<Subject[]>('subjects', []);

export const timetables = wStorage<{title: string, data: Timetable}[]>('timetable_templates', []);

export const plans = wStorage<{title: string, data: Plan}[]>('plans', []);
