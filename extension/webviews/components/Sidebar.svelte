<script lang="ts">
  import { onMount } from "svelte";
  import type { Lessons, User } from "../types";
  import Footer from "./Footer.svelte";

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

  const onLogout = () => {
    accessToken = "";
    user = null;
    lessons = [];
    tsvscode.postMessage({ type: "logout", value: undefined });
  };
</script>

{#if loading}
  <div>Loading...</div>
{:else if user}
  <div class="sidebar-container">
    <div class="sidebar-content">
      <h2 class="section-title">All lessons</h2>

      <!-- Show fetched lessons -->
      {#if lessons.length > 0}
        <ul>
          {#each lessons as lesson}
            <li class="lesson-elem">
              <div>
                {lesson.id}:
                {lesson.title}
              </div>
              <button
                class="open-file-button"
                on:click={() => {
                  tsvscode.postMessage({ type: "open-lesson", value: lesson });
                }}>Open</button
              >
            </li>
          {/each}
        </ul>
      {:else}
        <p>No lessons available</p>
      {/if}
    </div>

    <Footer name={user.name} {onLogout} />
  </div>
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
  h1,
  h2,
  button {
    user-select: none;
  }
  .login-btn {
    margin-top: 1rem;
    max-width: 200px;
  }
  .open-file-button {
    width: fit-content;
    padding: 0.5rem 1rem;
  }
  .lesson-elem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
  .sidebar-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .sidebar-container > *:not(footer) {
    flex: 1;
  }
  .section-title {
    padding-bottom: 2rem;
    border-bottom: 1px solid gray;
  }
</style>
