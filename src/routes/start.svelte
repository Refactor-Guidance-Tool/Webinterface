<script lang="ts">
    import { browser } from "$app/env";
	import { currentProjectUuid } from '../stores';
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';

    currentProjectUuid.update(uuid => $page.query.get("projectUuid"));

    if (browser) {
        goto("/");
    }
</script>

<style>
</style>