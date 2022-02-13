<script lang="ts">
    import type Message from "src/models/Message";

    export let messages: Message[];
</script>

<div class="container">
    {#each messages as msg}
        <div class="message {msg.type}">
            {msg.text}
        </div>
    {/each}
</div>


<style>
.container {
    display: flex;
    flex-flow: column;
    align-items: center;
}
.message {
    padding: 5px 10px;
    margin: 10px;
    border-radius: 15px;
    font-size: 1rem;
    color: white;
}
.message.info {
    background: #5555f1;
}
.message.succes {
    background: #00b900;
}
.message.error {
    background: #ee0000;
}
</style>