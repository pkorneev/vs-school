<script lang="ts">
  import { onMount } from "svelte";
  import type { Lessons, User, MyLessons } from "../types";
  import Footer from "./Footer.svelte";
  import Login from "./Login.svelte";
  import Status from "./Status.svelte";

  // !!!!!!!!!!!!!!!!! TODO !!!!!!!!!!!!!!!!!
  // Initialize user in db with already scoped lessons from mock json( the same mock json is used for listing lessons).
  // When user do some tasks, save his progress to those users lessons and now we can fetch base lessons and lessons scoped to user with progress.
  // In the sidebar we can distinguish between opnening base task and task with progress
  // As well we can submit a sollution before deadline, after deadline we will not be able to do that and would get negative response(saving also is impossible after deadline).
  // User can open base task or his progress task(should respect deadline as well). If he opens base task and tries to safe , but has already his sollution in progress stored, inform him about it, that he can rewrite his progress and it is not
  // want he may want to do.

  let loading = true;
  let user: User | null = null;
  let accessToken = "";
  let lessons: Lessons = []; // Store fetched lessons
  let myLessons: MyLessons = []; // Store fetched lessons
  let expandedLesson: number | null = null;

  // Reactive derived array
  let combinedLessons: MyLessons = [];

  $: combinedLessons = lessons.map((lesson) => {
    const myLesson = myLessons.find((ml) => ml.id === lesson.id);
    if (!myLesson) {
      return { ...lesson, status: "TO_DO" };
    } else {
      return myLesson;
    }
  });

  $: {
    const lessonsWithDeadlines = combinedLessons.map((lesson) => ({
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
              fetchMyLessons();
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

  // Function to fetch lessons
  async function fetchMyLessons() {
    try {
      const lessonsResponse = await fetch(`${apiBaseUrl}/myLessons`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      myLessons = await lessonsResponse.json();
    } catch (error) {
      console.error("Failed to fetch user's lessons", error);
    }
  }

  const onLogout = () => {
    accessToken = "";
    user = null;
    lessons = [];
    myLessons = [];
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
      {#if combinedLessons.length > 0}
        <ul>
          {#each combinedLessons as lesson}
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
  .lesson-comment {
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
