<script lang="ts">
    import type Timetable from "../../models/Timetable";

    export let template: Timetable;
    const rows = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

    $: subject_count = template.length;
</script>

{#each rows as day}
<div class="cell even">{day}</div>
    {#each Array(subject_count) as _, i }
        <div class="cell data" class:even={i%2==1}></div>
    {/each}
{/each}

<style>
    .data {
        cursor: pointer;
        border-top: 3px solid transparent;
        border-bottom: 2px solid transparent;
    }
    .data:hover {
        border: 2px solid red;
    }
    .cell {
        padding: 5px;
        border-bottom: 1px solid #0000003d;
    }
    .cell.even {
        background-color: #cbcbff;
    }
</style>