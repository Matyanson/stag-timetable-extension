<script lang="ts">
    import type Timetable from "../../models/Timetable";

    export let template: Timetable;
    export let editIndex: number = -1;

    const minutesToTime = (mins: number) => {
        const hours = Math.floor(mins / 60);
        const remainMinutes = mins % 60;
        const minutes_formated = '00'.substring(remainMinutes.toString().length) + remainMinutes;
        return `${hours}:${minutes_formated}`;
    }
</script>

<div class="cell header"></div>
{#each template as lesson, i}
<div class="cell header" class:edit={editIndex == i} on:click={() => editIndex = i}>
    <div class="number">{i}</div>
    <div class="time">
        {minutesToTime(lesson[0])}<br>
        {minutesToTime(lesson[1])}
    </div>
</div>
{/each}

<style>
    .cell {
        padding: 5px;
        border-bottom: 1px solid #0000003d;
    }
    .header {
        display: flex;
        flex-flow: row wrap;
        text-align: center;
        background-color: #8e8eff;
    }
    .header.edit {
        outline: 2px solid red;
        z-index: 2;
    }
    .number {
        font-size: 1.5rem;
        width: 1em;
    }
    .time {
        width: 3em;
    }
</style>