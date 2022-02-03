<script lang="ts">

    let url = "";

    async function fetchSubjects() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, {action: 'fetch_subjects', data: null}, (res) => {
            if (!chrome.runtime.lastError) {
                // if you have any response
                console.log('I have a response!');
                console.log(res);
            } else {
                console.log('there is an error');
                console.log(chrome.runtime.lastError);
            }
        });
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