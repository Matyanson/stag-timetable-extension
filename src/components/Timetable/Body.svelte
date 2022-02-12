<script lang="ts">
import { createEventDispatcher } from "svelte";

    import type { SubjectEvent } from "../../models/Plan";
    import type Timetable from "../../models/Timetable";

    export let template: Timetable;
    export let events: SubjectEvent[];
    const rows = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
    
    const dispatch = createEventDispatcher();

    $: subject_count = template.length;
    type TableCells = { 
        label: string,
        cells: SubjectEvent[]
    }[];
    let data: TableCells;
    $: {
        template, events,
        data = formatData();
    }

    const formatData = (): TableCells => {
        const res: TableCells = [];
        //fill with null
        for(let day of rows) {
            res.push({
                label: day,
                cells: Array(subject_count).fill(null)
            })
        }
        //insert subjects
        for(let event of events) {
            const target = res[event.day]?.cells[event.time];   //?. returns undefined
            if(target !== undefined)
                res[event.day].cells[event.time] = event;
        }
        return res;
    }
</script>

{#each data as day, d}
<div class="cell even label">{day.label}</div>
{#each day.cells as cellData, i}
    <div class="cell data" class:even={i%2==1} on:click={() => dispatch('click', {day: d, time: i})}>
        {#if cellData?.subject}
        <div class="event">
            {cellData.subject.title}
        </div>
        {/if}
    </div>
    {/each}
{/each}

<style>
    .data {
        cursor: pointer;
    }
    .data:hover {
        border: 2px solid red;
    }
    .cell {
        border-bottom: 1px solid #0000003d;
    }
    .cell.label {
        padding: 5px;
        color: black;
    }
    .cell.even {
        background-color: #cbcbff;
    }
    .event {
        padding: 3px;
        background: green;
        color: whitesmoke;
    }
</style>