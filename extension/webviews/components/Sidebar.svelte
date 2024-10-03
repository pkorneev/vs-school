<script lang="ts">
  import { onMount } from "svelte";
  import type { Lessons, User } from "../types";

  let loading = true;
  let user: User | null = null;
  let accessToken = "";
  let lessons: Lessons = []; // Store fetched lessons

  onMount(async () => {
    // Listen for messages from VS Code
    window.addEventListener("message", async (e) => {
      const message = e.data;

      switch (message.type) {
        case "token":
          // Store the access token
          accessToken = message.value;

          // Fetch the user details
          const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          user = data.user;
          loading = false;

          // Fetch lessons if the user is authenticated
          if (user) {
            fetchLessons();
          }
          break;
      }
    });

    // Request the token from VS Code
    tsvscode.postMessage({ type: "get-token", value: undefined });
  });

  // Function to fetch lessons
  async function fetchLessons() {
    try {
      const lessonsResponse = await fetch(`${apiBaseUrl}/lessons`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      lessons = await lessonsResponse.json();
      console.log(lessons);
    } catch (error) {
      console.error("Failed to fetch lessons", error);
    }
  }
</script>

{#if loading}
  <div>Loading...</div>
{:else if user}
  <h2>{user.name}</h2>

  <!-- Logout button -->
  <button
    class="logout-btn"
    on:click={() => {
      accessToken = "";
      user = null;
      lessons = []; // Clear lessons on logout
      tsvscode.postMessage({ type: "logout", value: undefined });
    }}
  >
    Logout
  </button>

  <!-- Show fetched lessons -->
  {#if lessons.length > 0}
    <ul>
      {#each lessons as lesson}
        <li>{lesson.id} {lesson.title}</li>
        <ul>
          {#each lesson.files as file}
            <li>{file.name}</li>
          {/each}
        </ul>
      {/each}
    </ul>
  {:else}
    <p>No lessons available</p>
  {/if}
{:else}
  <!-- Login button -->
  <button
    class="login-btn"
    on:click={() => {
      tsvscode.postMessage({ type: "authenticate", value: undefined });
    }}
  >
    Login with Google
  </button>
{/if}

<style>
  .logout-btn,
  .login-btn {
    margin-top: 1rem;
    max-width: 200px;
  }
</style>
