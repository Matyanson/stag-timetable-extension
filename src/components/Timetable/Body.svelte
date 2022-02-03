<script lang="ts">
import { createEventDispatcher } from "svelte";

    import type { SubjectEvent } from "../../models/Plan";
    import type Timetable from "../../models/Timetable";

    export let template: Timetable;
    export let events: SubjectEvent[];
    export let edit = false;
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

    const deleteSubject = (day: number, time: number) => {
        const res = events.filter((ev) => !(ev.day == day && ev.time == time));
        events = res;
    }
    const addSubject = (day: number, time: number) => {

    }
</script>

{#each data as day, d}
<div class="cell even label">{day.label}</div>
{#each day.cells as cellData, i}
    {#if cellData?.subject}
    <div class="cell data" class:even={i%2==1} class:edit>
        <div class="event">
            {cellData.subject.title}
            <button on:click={() => deleteSubject(d, i)}>delete</button>
        </div>
    </div>
    {:else}
    <div class="cell data" class:even={i%2==1} on:click={() => dispatch('click', {day: d, time: i})}>
    </div>
    {/if}
    {/each}
{/each}

<style>
    .data.edit {
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
    }
    .cell.even {
        background-color: #cbcbff;
    }
    .event {
        padding: 3px;
        background: green;
        color: whitesmoke;
    }
    .event button {
        display: none;
    }
    .edit .event button {
        display: block;
    }
</style>