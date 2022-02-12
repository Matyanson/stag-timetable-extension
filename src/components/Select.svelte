<script lang="ts">
    export let value;
    export let list: any[];
    export let titleKey: string = null;
</script>

<select bind:value >
    {#each list as item, i}
        <option value={i}>
            {#if titleKey}
                {item[titleKey]}
            {:else}
                {item}
            {/if}
        </option>
    {/each}
</select>

<style>
    select {
        margin: 10px;
        font-size: 1.1rem;
        padding: 5px 10px;
        background: #eee;
        border-radius: 10px;
    }
    select:focus {
        border: 2px solid #e07f00;
    }
    option {
        border-bottom: 1px solid black;
    }
</style>