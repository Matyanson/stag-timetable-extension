<script lang="ts">
    import Select from "../components/Select.svelte";
    import Button from "../components/Button.svelte";
    import type Subject from "../models/Subject";
    import { appSettings, plans, subjects } from "../store";
    import { onMount } from "svelte";
    import type Message from "../models/Message";
    import Messages from "../components/Messages.svelte";

    let planIndex = 0;
    let messages: Message[] = [];

    $:{
        messages;
        if(typeof(document) !== "undefined") {
            const win = document.getElementById('popup-window');
            setTimeout(() => win.scrollTo(0, win.scrollHeight), 200);
        }
    }

    async function fetchSubjects() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const data = {
            settings: $appSettings
        }
        chrome.tabs.sendMessage(tab.id, { action: 'fetch_subjects', data }, (res) => {
            if (!chrome.runtime.lastError)
                processSubjects(res);
            else
                messages.push({type: 'error', text: chrome.runtime.lastError.message});
        });
        const processSubjects = (newSubjects: Subject[]) => {
            if(newSubjects && newSubjects.length > 0)
                $subjects = newSubjects;
        }
    }
    async function enroll() {
        messages = [];
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const data = {
            settings: $appSettings,
            plan: $plans[planIndex]?.data
        }
        chrome.tabs.sendMessage(tab.id, { action: 'enroll_in_subjects', data }, (res) => {
            if (!chrome.runtime.lastError)
                console.log('succes');
            else{
                messages.push({type: 'error', text: chrome.runtime.lastError.message});
            }
        });
    }

    onMount(() => {
        chrome.runtime.onMessage.addListener((msg) => {
            const data = msg.data;
            switch(msg.type) {
                case 'new_message':
                    messages = [...messages, data];
                    break;
            }
        })
    })
    
</script>

<div id="popup-window" style="width: 270px;height: 350px">
    <main>
        <Button bg={'#f18623'} on:click={fetchSubjects}>Fetch subjects</Button><br><br>
        Select a plan:
        <Select bind:value={planIndex} list={$plans} titleKey={'title'} />
        <Button bg={'#f18623'} on:click={enroll}>enroll in subjects</Button>

        <br>Log:<br>
        <Messages messages={messages} />
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
</style>