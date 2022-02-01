<script lang="ts">
    import type Timetable from "../models/timetable";

    export let template: Timetable;

    $: column_count = template.length;

    
    const minutesToTime = (mins: number) => {
        const hours = Math.floor(mins / 60);
        const remainMinutes = mins % 60;
        return `${hours}:${remainMinutes}`;
    }
</script>

<div class="table" style="--column-count:{column_count}">
    <div class="row header">
        {#each template as lesson}
        <div class="item">{minutesToTime(lesson[0]) + " - "+minutesToTime(lesson[1])}</div>
        {/each}
    </div>
</div>

<style>
    .table {
        display: grid;
        grid-template-columns: repeat(var(--column-count), auto);
        background: green;
    }
</style>
