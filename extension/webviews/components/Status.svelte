<script lang="ts">
  import type { Status } from "../types";

  export let status: Status;
</script>

{#if status === "TO_DO"}
  <div class="status-box to-do">To do</div>
{:else if status === "IN_PROGRESS"}
  <div class="status-box in-progress">In progress</div>
{:else if status === "SUBMITTED"}
  <div class="status-box submitted">Submitted</div>
{:else if status === "COMPLETED"}
  <div class="status-box completed">Completed</div>
{/if}

<style>
  .status-box {
    padding: 0.5rem;
    border: 1px solid gray;
    width: 80px;
    text-align: center;
    user-select: none;
    border-radius: 1rem;
    font-size: 0.9rem;
  }

  .completed {
    color: rgb(2, 209, 2);
    border-color: rgb(2, 209, 2);
  }
  .submitted {
    color: yellow;
    border-color: yellow;
  }
  .in-progress {
    color: rgb(255, 153, 0);
    border-color: rgb(255, 153, 0);
  }
</style>
