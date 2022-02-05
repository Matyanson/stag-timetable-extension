<script lang="ts">
    export let obj;

    const isArray = Array.isArray(obj);

    const onDelete = (index: number) => {
        obj = [
            ...obj.slice(0, index),
            ...obj.slice(index + 1)
        ]
    }
    const onAdd = (type: string) => {
        let newItem;
        switch(type) {
            case 'number': newItem = 0; break;
            case 'boolean': newItem = false; break;
            default: newItem = ''; break;
        }
        obj = [...obj, newItem];
    }
</script>

{#if obj == null}
    <div class="null">{String(obj)}</div>
{:else if typeof obj === "number"}
    <input type="number" bind:value={obj} />
{:else if typeof obj === "string"}
    <input type="text" bind:value={obj} />
{:else if typeof obj === "boolean"}
    <input type="checkbox" bind:value={obj} />
{:else if isArray}
    <div class="collection">
        {#each obj as item, i}
        <div class="value">
            <svelte:self bind:obj={obj[i]} />
        </div>
        <button on:click={() => onDelete(i)}>delete</button>
        {/each}
        <button on:click={() => onAdd(typeof obj[0])}>add</button>
    </div>
{:else if typeof obj === "object"}
    <div class="collection">
        {#each Object.entries(obj) as [key, value]}
        <div class="property">
            <div class="key">{key}: </div>
            <div class="value">
                <svelte:self bind:obj={obj[key]}/>
            </div>
        </div>
        {/each}
    </div>
{:else}
    {String(obj)}
{/if}

<style>
    .property {
        display: flex;
        flex-flow: row wrap;
        padding: 5px;
        border-bottom: 1px black solid;
    }
</style>