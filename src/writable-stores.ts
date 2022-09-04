import { Writable, writable } from "svelte/store";
import { object_equals } from "./helper";

export const wStorage = <T>(key: string, initValue: T): Writable<T> => {
    const store = writable(initValue);
    if (typeof Storage === 'undefined') return store;

    const storedValueStr = localStorage.getItem(key);
    if (storedValueStr != null) store.set(JSON.parse(storedValueStr));

    store.subscribe((val) => {
        localStorage.setItem(key, JSON.stringify(val));
    })
    return store;
}

export const wSync = <T>(key: string, initValue: T): Writable<T> => {

    if (typeof chrome === 'undefined') {
        return writable(initValue);;
    }
    
    const { set, update, subscribe } = writable<T>(initValue);
    let firedFirst = false;

    function syncStorage() {
        chrome.storage.sync.get([key], (valueMap) => {
            if (valueMap[key] != null && valueMap[key]) {
                set(valueMap[key]);
            }
        })
    }
    
    subscribe((val) => {
        if(!firedFirst){
            syncStorage();
            firedFirst = true;
        }
        else {
            chrome.storage.sync.set({ [key]: val });
        }
    });

    chrome.storage.onChanged.addListener((changes: object, areaName: string) => {
        const change = changes[key];
        if(change && !object_equals(change.newValue, change.oldValue)) {
            set(change.newValue);
        }
    })

    return { set, update, subscribe };
}