<script lang="ts">
    import Select from "../components/Select.svelte";
    import Button from "../components/Button.svelte";
    import type Subject from "../models/Subject";
    import { appSettings, plans, subjects } from "../store";

    let planIndex = 0;

    async function fetchSubjects() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const data = {
            settings: $appSettings
        }
        chrome.tabs.sendMessage(tab.id, { action: 'fetch_subjects', data }, (res) => {
            if (!chrome.runtime.lastError)
                processSubjects(res);
            else
                console.log(chrome.runtime.lastError);
        });
        const processSubjects = (newSubjects: Subject[]) => {
            if(newSubjects && newSubjects.length > 0)
                $subjects = newSubjects;
        }
    }
    async function enroll() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const data = {
            settings: $appSettings,
            plan: $plans[planIndex]?.data
        }
        chrome.tabs.sendMessage(tab.id, { action: 'enroll_in_subjects', data }, (res) => {
            if (!chrome.runtime.lastError)
                console.log('succes');
            else
                console.log(chrome.runtime.lastError);
        });
    }
</script>

<div id="popup-window" style="width: 250px;height: 350px">
    <main>
        <Button bg={'#f18623'} on:click={fetchSubjects}>Fetch subjects</Button><br><br>
        Select a plan:
        <Select bind:value={planIndex} list={$plans} titleIndex={'title'} />
        <Button bg={'#f18623'} on:click={enroll}>enroll in subjects</Button>
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
    }
    main {
        box-sizing: border-box;
        display: flex;
        flex-flow: column;
        align-items: center;
        padding: 20px;
        height: 100%;
        width: 100%;
        background: linear-gradient(#4242f0, #000081);
        color: white;
        font-size: 1.5rem;
    }
</style>