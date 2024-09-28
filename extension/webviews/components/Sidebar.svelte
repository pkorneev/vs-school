<script lang="ts">
  import { onMount } from "svelte";
    let loading = true;
    let user: {name:  string, id: string} | null  = null;

    onMount( async ()=> {
        const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        user = data.user;
        loading = false;
    })
</script>

<style>
    
</style>

{#if loading}
<div>loading...</div>
{:else if user}
<pre>{JSON.stringify(user,null,2)}</pre> 
{:else}
<div>no user is logged in</div>
{/if}
