<script lang="ts">
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

<div id="popup-window" style="width: 400px;height: 500px">
    <button on:click={fetchSubjects}>Fetch the subjects</button><br><br>
    Select a plan:
    <select bind:value={planIndex} >
        {#each $plans as plan, i}
            <option value={i}>
                {plan.title}
            </option>
        {/each}
    </select><br>
    <button on:click={enroll}>enroll in subjects</button>

</div>

<style>
    #popup-window {
        box-sizing: border-box;
        padding: 8px;
        max-width: 800px;
        max-height: 600px;
        min-width: 200px;
        min-height: 150px;
        resize: vertical;
        overflow: auto;
    }
</style>