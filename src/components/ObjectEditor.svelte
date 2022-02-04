<script lang="ts">
    export let obj;

    const onDelete = (key: string, index: number) => {
        obj[key] = [
            obj[key].slice(0, index),
            obj[key].slice(index + 1)
        ]
    }
    const onAdd = (key: string) => {
        obj[key] = [...obj[key], ''];
    }
</script>

{#each Object.entries(obj) as [key, value]}
    <div class="property">
        <div class="key">{key} : </div>
        <div class="value">
            {#if Array.isArray(value)}
                <div class="collection">
                    {#each value as item, i}
                    <input type="text" bind:value={obj[key][i]} />
                    <button on:click={() => onDelete(key, i)}>delete</button>
                    {/each}
                    <button on:click={() => onAdd(key)}>add</button>
                </div>
            {:else}
                <input type="text" bind:value={obj[key]} />
            {/if}
        </div>
    </div>
{/each}

<style>
    .property {
        display: flex;
        flex-flow: row wrap;
        padding: 5px;
        border-bottom: 1px black solid;
    }
</style>