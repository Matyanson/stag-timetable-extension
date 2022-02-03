<button on:click>
    <slot></slot>
</button>

<style>
    button {
        background-color: whitesmoke;
        border: 2px solid #2323f1;
        border-radius: 5px;
        margin: 10px;
        color: black;
        padding: 10px 15px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 1.2rem;
        cursor: pointer;

        transition: all 0.2s;
    }
    button:hover {
        background-color: #2323f1;
        color: white;
    }
</style>