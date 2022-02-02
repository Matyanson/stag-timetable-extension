<script lang="ts">
    import default_timetable from "../assets/default_timetable";
    import Timetable from "../components/Timetable/index.svelte";

    let timetable_template = default_timetable;

</script>
<h1>Options Page</h1>
<Timetable bind:template={timetable_template} />