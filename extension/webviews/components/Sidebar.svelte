<script lang="ts">
  import { onMount } from "svelte";
  import type { User, MyLessons } from "../types";
  import Footer from "./Footer.svelte";
  import Login from "./Login.svelte";
  import Status from "./Status.svelte";

  let loading = true;
  let user: User | null = null;
  let accessToken = "";
  let lessons: MyLessons = []; // Store fetched lessons
  let expandedLesson: number | null = null;

  $: {
    const lessonsWithDeadlines = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      deadline: lesson.deadline, // Include the deadline property
    }));

    tsvscode.postMessage({
      type: "lessonsWithDeadlines",
      value: lessonsWithDeadlines, // Send updated lessons with deadlines
    });
  }

  function toggleLesson(id: number) {
    expandedLesson = expandedLesson === id ? null : id;
  }

  function resetAuthState() {
    accessToken = "";
    user = null;
    loading = false; // Ensures login button is displayed
  }

  onMount(async () => {
    window.addEventListener("message", async (e) => {
      const message = e.data;

      switch (message.type) {
        case "token":
          try {
            accessToken = message.value;
            const response = await fetch(`${apiBaseUrl}/me`, {
              headers: { authorization: `Bearer ${accessToken}` },
            });

            if (!response.ok) throw new Error("Failed to authenticate");

            const data = await response.json();
            user = data.user;
            loading = false;

            if (user) {
              fetchAllLessons();
            }
          } catch (error) {
            console.error("Authentication failed:", error);
            resetAuthState();
          }
          break;
      }
    });

    tsvscode.postMessage({ type: "get-token", value: undefined });
  });

  // Function to fetch all lessons
  async function fetchAllLessons() {
    try {
      const lessonsResponse = await fetch(`${apiBaseUrl}/allLessons`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      lessons = await lessonsResponse.json();
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

  const onLogin = () => {
    tsvscode.postMessage({ type: "authenticate", value: undefined });
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
            <li class="lesson-elem" on:click={() => toggleLesson(lesson.id)}>
              <div class="lesson-short">
                <div>
                  {lesson.id}: {lesson.title}
                </div>
                <div class="status-and-chevron">
                  {#if lesson.status === "COMPLETED"}
                    <span class="lesson-points">{lesson.points}</span>
                  {/if}
                  <Status status={lesson.status} />
                  <div
                    class="chevron {expandedLesson === lesson.id ? 'open' : ''}"
                  >
                    >
                  </div>
                </div>
              </div>

              {#if expandedLesson === lesson.id}
                <div class="lesson-details">
                  <p class="lesson-deadline">
                    Deadline: {new Date(lesson.deadline).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long", // Show the full weekday name
                        year: "numeric", // Show the year as a number
                        month: "long", // Show the full month name
                        day: "numeric", // Show the day of the month
                      }
                    )}
                  </p>
                  {#if lesson.status === "COMPLETED"}
                    <p class="lesson-comment">{lesson.comment}</p>
                  {/if}
                  <button
                    class="open-file-button"
                    on:click={() => {
                      tsvscode.postMessage({
                        type: "open-lesson",
                        value: lesson,
                      });
                    }}
                  >
                    Open
                  </button>
                </div>
              {/if}
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
  <Login {onLogin} />
{/if}

<style>
  h2,
  button,
  .chevron {
    user-select: none;
  }
  .lesson-short {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }
  .lesson-points {
    font-size: 1.5rem;
    color: rgb(2, 209, 2);
  }
  .lesson-comment,
  .lesson-deadline {
    margin-top: 1rem;
  }
  .status-and-chevron {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .lesson-elem {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    cursor: pointer;
    padding-bottom: 1rem;
    border-bottom: 1px solid gray;
  }

  .chevron {
    transform: rotate(90deg);
    font-size: 1.25rem;
    font-weight: 100;
  }

  .chevron.open {
    transform: rotate(0deg);
  }

  .open-file-button {
    width: 100%;
    padding: 0.5rem;
    margin-top: 2rem;
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
    margin-top: 1rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid gray;
  }
</style>
