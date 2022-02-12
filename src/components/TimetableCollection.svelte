<script lang="ts">
    import { timetables } from "../store";
    import Button from "./Button.svelte";
    import CrudItem from "./CRUDItem.svelte";
    import Timetable from './Timetable/index.svelte';
    import Window from "./Window.svelte";
    import default_timetable from '../assets/default_timetable';

    let selected = -1;
    let windowOpened = false;
    
    const createNew = () => {
        timetables.update(old => {
            return [...old, {title: "New Timetable", data: default_timetable}];
        })
        selected = $timetables.length -1;
    }
    const onEdit = (index: number) => {
        selected = index;
        windowOpened = true;
    }
    const onDelete = (index: number) => {
        timetables.update(old => {
            return [
                ...old.slice(0, index),
                ...old.slice(index + 1)
            ]
        })
    }
    
</script>


<div class="collection">
{#each $timetables as t, i}
    <CrudItem 
        selected={i == selected}
        title={t.title}
        on:edit={() => onEdit(i)}
        on:delete={() => onDelete(i)}
    />
{/each}
    <Button on:click={createNew} >New</Button>
</div>

{#if $timetables[selected]}
<Window bind:isOpen={windowOpened} title={`editing: ${$timetables[selected].title}`}>
    <h1>{$timetables[selected].title}</h1>
    title: <input type="text" bind:value={$timetables[selected].title} />
    <Timetable edit={true} bind:template={$timetables[selected].data}/>
</Window>
{/if}

<style>
    .collection {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
    }
</style>