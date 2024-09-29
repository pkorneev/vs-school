<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";

  let loading = true;
  let user: User | null = null;
  let accessToken = "";

  onMount(async () => {
    window.addEventListener("message", async (e) => {
      const message = e.data;
      switch (message.type) {
        case "token":
          accessToken = message.value;
          const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          user = data.user;
          loading = false;
      }
    });
    tsvscode.postMessage({ type: "get-token", value: undefined });
  });
</script>

{#if loading}
  <div>loading...</div>
{:else if user}
  <pre>{JSON.stringify(user, null, 2)}</pre>
  <button
    on:click={() => {
      accessToken = "";
      user = null;
      tsvscode.postMessage({ type: "logout", value: undefined });
    }}>Logout</button
  >
{:else}
  <div>no user is logged in</div>
  <button
    on:click={() => {
      console.log("clicked");
      tsvscode.postMessage({ type: "authenticate", value: undefined });
    }}>Login with Google</button
  >
{/if}

<style>
</style>
