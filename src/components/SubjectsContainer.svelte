<script lang="ts">
import type Subject from "../models/Subject";
import { subjects } from "../store";


    export let selected: Subject = null;

    const groupByYear = () => {
        const res: {[key: number]: Subject[]} = {};
        for( let sbj of ($subjects as Subject[])) {
            if(!res.hasOwnProperty(sbj.year)) res[sbj.year] = [sbj];
            else res[sbj.year].push(sbj);
        }
        return res;
    }

    const groupedSubjects = groupByYear();

    
</script>

{#if $subjects?.length > 0}
<div class="container">
    {#each Object.entries(groupedSubjects) as [key, value] }
        <div class="yearGroup">
            <div class="number">{key}</div>
            <div class="subjects">
                {#each value as subject}
                    <div class="subj" class:selected={subject?.id == selected?.id} on:click={() => selected = subject}>
                        {subject.title}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
{/if}

<style>
.container {
    display: flex;
    flex-flow: row;
    padding: 5px;
    background: #434343;
    width: fit-content;
}
.yearGroup {
    display: flex;
    flex-flow: column;
    margin: 5px;
}
.number {
    text-align: center;
    color: whitesmoke;
}
.subjects {
    display: flex;
    flex-flow: column;
}
.subj {
    padding: 3px;
    margin: 2px;
    background: green;
    color: white;
    cursor: pointer;
}
.subj.selected {
    border: 2px red solid;
}
</style>