import { Writable, writable } from "svelte/store";

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
    const store = writable(initValue);
    if (typeof chrome === 'undefined') return store;

    (async ()=>{
        const valueMap = await chrome.storage.sync.get(key);
        if (valueMap.key != null) store.set(valueMap.key);
    })();

    store.subscribe((val) => {
        chrome.storage.sync.set({ key: val });
    })
    return store;
}