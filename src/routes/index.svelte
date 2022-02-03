<script lang="ts">
import type Subject from "../models/Subject";
import { subjects } from "../store";

    async function fetchSubjects() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, {action: 'fetch_subjects', data: null}, (res) => {
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
</script>
<div id="popup-window" style="width: 400px;height: 500px">
    <button on:click={fetchSubjects}>Fetch the subjects</button>
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