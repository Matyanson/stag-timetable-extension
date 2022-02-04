<script lang="ts">
    import SubjectsContainer from "../components/SubjectsContainer.svelte";
    import PlansCollection from "../components/PlansCollection.svelte";
    import TimetableEditor from "../components/TimetableCollection.svelte";
    import ObjectEditor from "../components/ObjectEditor.svelte";
    import { appSettings } from "../store";

</script>

<main>
    <h1>Options Page</h1>

    <h1>List of subjects</h1>
    <SubjectsContainer />
    
    <h1>Timetable collection</h1>
    <TimetableEditor />
    
    <h1>Schedule collection</h1>
    <PlansCollection />
    
    <h1>Settings</h1>
    <ObjectEditor bind:obj={$appSettings}/>
</main>


<style>
    main {
        margin: 10px;
        margin-bottom: 200px;
    }
</style>