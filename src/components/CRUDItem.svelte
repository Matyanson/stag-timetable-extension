<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let title: string;
    export let selected = false;

    const dispatch = createEventDispatcher();
</script>

<div class="item" class:selected>
    <div class="title">{title}</div>
    <div class="options">
        <button on:click={() => dispatch('edit')}>edit</button>
        <button on:click={() => dispatch('delete')}>delete</button>
    </div>
</div>


<style>
    .item.selected {
        border: 2px solid red; 
    }
    .item {
        display: flex;
        flex-flow: column;
        margin: 10px;
        padding: 10px;
        width: fit-content;
        background: #4b4bcb;
        border-radius: 5px;
    }
    .title {
        font-size: 1.5rem;
        text-align: center;
    }
    .options {
        display: flex;
        flex-flow: row;
    }
</style>