<script lang="ts">
    import SubjectsContainer from "../components/SubjectsContainer.svelte";
    import PlansCollection from "../components/PlansCollection.svelte";
    import TimetableEditor from "../components/TimetableCollection.svelte";
    import ObjectEditor from "../components/ObjectEditor.svelte";
    import { appSettings } from "../store";

</script>

<main>
    <h1>List of subjects</h1>
    <SubjectsContainer />
    
    <h1>Timetable collection</h1>
    <TimetableEditor />
    
    <h1>Plans collection</h1>
    <PlansCollection />
    
    <h1>Settings</h1>
    <ObjectEditor bind:obj={$appSettings}/>
</main>


<style>
    main {
        padding: 50px;
        background: #24274A;
        color: white;
    }
</style>