<script lang="ts">
    import { plans } from '../store';
    import CrudItem from './CRUDItem.svelte';
    import Button from './Button.svelte';
    import Window from './Window.svelte';
    import default_timetable from '../assets/default_timetable';
    import PlanEditor from './PlanEditor.svelte';

    let selected = -1;
    let windowOpened = false;

    const createNew = () => {
        plans.update(old => {
            return [...old,
                {
                    title: "New plan",
                    data: { timetable: default_timetable, events: [] }
                }
            ];
        })
        selected = $plans.length -1;
    }
    const onEdit = (index: number) => {
        selected = index;
        windowOpened = true;
    }
    const onDelete = (index: number) => {
        plans.update(old => {
            return [
                ...old.slice(0, index),
                ...old.slice(index + 1)
            ]
        })
    }
    
</script>

<div class="collection">
{#each $plans as p, i}
    <CrudItem 
        selected={i == selected}
        title={p.title}
        on:edit={() => onEdit(i)}
        on:delete={() => onDelete(i)}
    />
{/each}
    <Button on:click={createNew} >New</Button>
</div>

{#if $plans[selected]}
<Window bind:isOpen={windowOpened} title="editing: {$plans[selected].title}">
    <h1>{$plans[selected].title}</h1>
    title: <input type="text" bind:value={$plans[selected].title} />
    <PlanEditor 
        bind:timetableTemplate={$plans[selected].data.timetable}
        bind:subjectEvents={$plans[selected].data.events}
    />
</Window>
{/if}

<style>
    .collection {
        display: flex;
        flex-flow: row wrap;
    }
</style>
