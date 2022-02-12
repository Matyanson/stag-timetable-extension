<script lang="ts">
    import type ITimetable from "../models/Timetable";
    import { plans, timetables } from "../store";
    import default_timetable from "../assets/default_timetable";
    import SubjectsContainer from "./SubjectsContainer.svelte";
    import Timetable from "./Timetable/index.svelte";
    import type { SubjectEvent } from "../models/Plan";
    import Select from "./Select.svelte";
    import type Plan from "../models/Plan";


    let selectedSubject = null;
    let timetableIndex = 0;
    export let timetableTemplate: ITimetable = null;
    export let subjectEvents: SubjectEvent[] = [];
    let timetableList: {title: string, data: ITimetable}[];

    let planString = '';
    let errorMsg = '';
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
    const copy = () => {
        const planData: Plan = {
            timetable: timetableTemplate,
            events: subjectEvents
        };
        const text = JSON.stringify(planData);
        navigator.clipboard.writeText(text);
    }
    const importData = () => {
        try {
            errorMsg = '';
            const data: Plan = JSON.parse(planString);
            if(!data.events || !data.timetable) throw "";
            
            subjectEvents = data.events;
            if(isDefaultTimetable(data.timetable)){
                timetableIndex = 0;
            } else {
                timetableIndex = timetableList.length; //the future last index
                timetables.update(old => [...old, { title: 'Imported timetable', data: data.timetable }]);
            }

            timetableTemplate = data.timetable;

        } catch (e) {
            errorMsg = "couldn't process the data";
        }
        planString = '';

        function isDefaultTimetable(timetable: ITimetable) {
            if(timetable.length !== default_timetable.length)
                return false;
            for(let i in timetable) {
                const timesA = timetable[i];
                const timesB = default_timetable[i];
                if(timesA[0] !== timesB[0] || timesA[1] !== timesB[1])
                    return false;
            }
            return true;
        }
    }
</script>

<!-- Select subject to place on the timetable -->
<SubjectsContainer bind:selected={selectedSubject} />

<!-- Select which Timetable to use -->
<Select bind:value={timetableIndex} list={timetableList} titleKey={'title'} />
<button on:click={() => subjectEvents = []}>clear all subjects</button>
<button on:click={copy}>copy plan</button>
<div>
    <input id="importText" type="text" bind:value={planString} />
    <button on:click={importData}>import from text</button>
    <div class="error">{errorMsg}</div>
</div>

{#if timetableTemplate}
    <Timetable
        template={timetableTemplate}
        bind:events={subjectEvents}
        on:click={handleSubject}
    />
{/if}

<style>
    #importText {
        max-width: 30em;
    }
    .error {
        color: red;
    }
</style>