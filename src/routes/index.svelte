<script lang="ts">
    import Select from "../components/Select.svelte";
    import Button from "../components/Button.svelte";
    import type Subject from "../models/Subject";
    import { appSettings, plans, subjects } from "../store";
    import { onMount } from "svelte";
    import type Message from "../models/Message";
    import Messages from "../components/Messages.svelte";
    import Settings from "../assets/icons/Settings.svelte";
    import { wStorage } from "../writable-stores";

    let planIndex = 0;
    let messages = wStorage<Message[]>('system_messages', []);

    $:{
        messages;
        if(typeof(document) !== "undefined") {
            const win = document.getElementById('popup-window');
            setTimeout(() => win.scrollTo(0, win.scrollHeight), 200);
        }
    }
    onMount(() => {
        chrome.runtime.onMessage.addListener((msg) => {
            const data: Message = msg.data;
            switch(msg.type) {
                case 'new_message':
                    $messages = [...$messages, data];
                    break;
            }
        })
    })

    async function fetchSubjects() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const data = {
            settings: $appSettings
        }
        chrome.tabs.sendMessage(tab.id, { action: 'fetch_subjects', data }, (res) => {
            if (!chrome.runtime.lastError)
                processSubjects(res);
            else{
                $messages = [...$messages, {type: 'error', text: chrome.runtime.lastError.message + 'frompopup'}];
            }
                
        });
        const processSubjects = (newSubjects: Subject[]) => {
            if(newSubjects && newSubjects.length > 0)
                $subjects = newSubjects;
        }
    }
    async function enroll() {
        $messages = [];
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const data = {
            settings: $appSettings,
            plan: $plans[planIndex]?.data
        }
        chrome.tabs.sendMessage(tab.id, { action: 'enroll_in_subjects', data }, (res) => {
            if (!chrome.runtime.lastError)
                console.log('succes');
            else{
                $messages = [...$messages, {type: 'error', text: chrome.runtime.lastError.message + 'frompopup'}];
            }
        });
    }

    function openOptions() {
        chrome.runtime.openOptionsPage();
    }
    
</script>

<div id="popup-window" style="width: 270px;height: 400px">
    <main>
        <Button bg={'#f18623'} on:click={fetchSubjects}>Fetch subjects</Button><br><br>
        Select a plan:
        <Select bind:value={planIndex} list={$plans} titleKey={'title'} />
        <Button bg={'#f18623'} on:click={enroll}>enroll in subjects</Button>

        <br>Log:<br>
        <Messages messages={$messages} />
        <div id="options-button" on:click={openOptions}><Settings /></div>
    </main>
</div>

<style>
    #popup-window {
        box-sizing: border-box;
        max-width: 800px;
        max-height: 600px;
        min-width: 200px;
        min-height: 150px;
        resize: vertical;
        overflow: auto;
        background: linear-gradient(#4242f0, #000081);
        scroll-behavior: smooth;
    }
    main {
        box-sizing: border-box;
        display: flex;
        flex-flow: column;
        align-items: center;
        padding: 20px;
        height: 100%;
        width: 100%;
        color: white;
        font-size: 1.5rem;
    }
    #options-button {
        position: fixed;
        top: 13px;
        right: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }
    #options-button:hover {
        color: #e07f00;
    }
</style>