<script lang="ts">
    import type ITimetable from "../models/Timetable";
    import { timetables } from "../store";
    import default_timetable from "../assets/default_timetable";
    import SubjectsContainer from "./SubjectsContainer.svelte";
    import Timetable from "./Timetable/index.svelte";
    import type { SubjectEvent } from "../models/Plan";


    let selectedSubject = null;
    let timetableIndex = 0;
    export let timetableTemplate: ITimetable = null;
    export let subjectEvents: SubjectEvent[] = [];
    let timetableList: {title: string, data: ITimetable}[];
    $: timetableList = [{title: 'default', data: default_timetable}].concat($timetables);
    
    $: timetableTemplate = timetableList[timetableIndex].data;

    const handleSubject = (e) => {
        const data: {day: number, time: number} = e.detail;
        const presentSubjectIndex = subjectEvents.findIndex(sub => sub.day == data.day && sub.time == data.time);

        if(presentSubjectIndex == -1)
            addSubjectEvent(e);
        else
            deleteSubjectEvent(presentSubjectIndex);
    }

    const addSubjectEvent = (e) => {
        const data: {day: number, time: number} = e.detail;
        if(selectedSubject)
            subjectEvents = [ ...subjectEvents, {...data, subject: selectedSubject} ];
    }

    const deleteSubjectEvent = (index) => {
        subjectEvents = [
            ...subjectEvents.slice(0, index),
            ...subjectEvents.slice(index + 1)
        ]
    }
</script>

<!-- Select subject to place on the timetable -->
<SubjectsContainer bind:selected={selectedSubject} />

<!-- Select which Timetable to use -->
<select bind:value={timetableIndex} >
    {#each timetableList as template, i}
        <option value={i}>
            {template.title}
        </option>
    {/each}
</select>
{timetableIndex}
<button on:click={() => subjectEvents = []}>clear all subjects</button>

{#if timetableTemplate}
    <Timetable
        template={timetableTemplate}
        bind:events={subjectEvents}
        on:click={handleSubject}
    />
{/if}

<style>

</style>