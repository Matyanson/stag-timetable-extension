<script lang="ts">
    import type Timetable from "../../models/Timetable";

    export let template: Timetable;
    export let editIndex: number;

    const deleteColumn = () => {
        template = [
            ...template.slice(0, editIndex),
            ...template.slice(editIndex + 1)
        ]
        if(editIndex >= template.length) editIndex = template.length - 1;
    }
    const addColumn = () => {
        const average_time = template.length > 0 ? template.map(x => x[1] - x[0]).reduce((sum, cur) => sum + cur) / template.length : 45;
        const prev_end = template[template.length - 1]?.[1] ?? 0;
        const start = prev_end + 5;
        const end = start + Math.floor(average_time);
        template = [...template, [start, end]];
        editIndex = template.length - 1;
    }
</script>

<div class="settingsBar">
    {#if editIndex > -1 && template[editIndex]}
        <div class="modify">
            start: 
            <input type="range"
                min={template[editIndex - 1]?.[1] ?? 0}
                max={template[editIndex][1] ?? 1440}
                bind:value={template[editIndex][0]}
                step={5}
            />
            end:
            <input type="range"
                min={template[editIndex][0] ?? 0}
                max={template[editIndex + 1]?.[0] ?? 1440}
                bind:value={template[editIndex][1]}
                step={5}
            />
        </div>
    {/if}
    <div class="options">
        <button on:click={addColumn} >Add</button>
        <button on:click={deleteColumn}>Delete</button>
    </div>
</div>

<style>
    .settingsBar {
        display: flex;
        flex-flow: row;
        width: 100%;
        height: 20px;
        background: #eeeeee;
    }
    .modify {
        flex: 1;
    }
</style>