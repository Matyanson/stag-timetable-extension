<script lang="ts">
import type { SubjectEvent } from "src/models/Plan";

    import type Timetable from "../../models/Timetable";
    import Body from "./Body.svelte";
    import Header from "./Header.svelte";
    import SettingsBar from "./SettingsBar.svelte";

    export let template: Timetable;
    export let events: SubjectEvent[] = [];
    export let edit = false;

    $: grid_columns = getGridColumns(template)

    let editIndex = edit ? template.length - 1 : -1;

    const getGridColumns = (t: Timetable) => {
        const lengths = t.map(x => x[1] - x[0]);
        const average_time = lengths.length > 1 ? lengths.reduce((sum, cur) => sum + cur) / t.length : 0;
        const res = lengths.map(t => t / average_time+'fr').join(' ');
        return res;
    }
</script>

<div class="wrap">
    {#if edit}
        <SettingsBar bind:template bind:editIndex />
    {/if}
    <div class="table" style="--grid-columns: {'auto '+grid_columns}">
        <!-- Header -->
        <Header bind:template bind:editIndex />
        <!-- Rows -->
        <Body template={template} bind:events on:click />
    </div>
</div>


<style>
    .table {
        display: grid;
        grid-template-columns: var(--grid-columns);
        background: #eeeeee;
        overflow-x: auto;
    }
    .wrap {
        position: relative;
        display: flex;
        flex-flow: column;
        margin: 5px;
    }
</style>
