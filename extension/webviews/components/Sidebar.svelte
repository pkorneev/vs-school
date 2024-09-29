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
  <h2>{user.name}</h2>
  <button
    class="logout-btn"
    on:click={() => {
      accessToken = "";
      user = null;
      tsvscode.postMessage({ type: "logout", value: undefined });
    }}>Logout</button
  >
{:else}
  <button
    class="login-btn"
    on:click={() => {
      tsvscode.postMessage({ type: "authenticate", value: undefined });
    }}>Login with Google</button
  >
{/if}

<style>
  .logout-btn,
  .login-btn {
    margin-top: 1rem;
    max-width: 200px;
  }
</style>
