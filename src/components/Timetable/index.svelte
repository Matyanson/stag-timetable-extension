<script lang="ts">
    import type Timetable from "../../models/timetable";
    import Body from "./Body.svelte";
    import Header from "./Header.svelte";

    export let template: Timetable;

    $: grid_columns = getGridColumns(template)

    const getGridColumns = (t: Timetable) => {
        const lengths = t.map(x => x[1] - x[0])
        const average_time = lengths.reduce((sum, cur) => sum + cur) / t.length;
        const res = lengths.map(t => t / average_time+'fr').join(' ');
        return res;
    }
</script>

<div class="table" style="--grid-columns: {'auto '+grid_columns}">
    <!-- Header -->
    <Header bind:template />
    <!-- Rows -->
    <Body bind:template />
</div>

<style>
    .table {
        display: grid;
        grid-template-columns: var(--grid-columns);
        margin: 5px;
        background: #eeeeee;
        overflow-x: auto;
    }
</style>
