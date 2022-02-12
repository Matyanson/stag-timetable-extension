<script lang="ts">
    export let bg = '#2323f1';
    export let color = 'white';
</script>
<button on:click style="--bg:{bg};--color:{color}">
    <slot></slot>
</button>

<style>
    button {
        background-color: whitesmoke;
        border: 2px solid var(--bg);
        border-radius: 30px;
        margin: 10px;
        color: black;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 1.2rem;
        cursor: pointer;

        transition: all 0.2s;
    }
    button:hover {
        background-color: var(--bg);
        color: var(--color);
    }
</style>