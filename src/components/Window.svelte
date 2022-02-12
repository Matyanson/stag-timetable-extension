<script>
    export let isOpen = false;
    export let title = "";
    let temporarelyClosed = true;
    $: if(isOpen) temporarelyClosed = false;
</script>

{#if isOpen}
<div class="window">
    <div class="titleBar">
        <div class="title">{title}</div>
        <button class="exit" on:click={() => isOpen = false}>X</button>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</div>
{/if}

<style>
.window {
    border: 3px solid #8a8a8a;
}
.titleBar {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    padding: 5px;
    margin-bottom: 10px;
    background: #eee;
    color: black;
}
.title {
    flex: 1;
    text-align: center;
}
.exit {
    border: none;
    background: red;
    color: whitesmoke;
    padding: 5px;
}
.content {
    padding: 10px;
}
</style>