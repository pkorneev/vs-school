<script lang="ts">
  export let onLogin: () => void;
  let errorMessage = "";

  window.addEventListener("message", (event) => {
    const { type } = event.data;
    if (type === "auth-failed") {
      errorMessage = "Authentication was cancelled or timed out.";
    }
  });
</script>

<div class="login-container">
  <h1>Log in</h1>
  <h3>Welcome to VS-School</h3>
  <button on:click={onLogin}>Continue with VUT</button>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
</div>

<style>
  .login-container {
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .login-container h3 {
    margin-top: 2rem;
  }
  .login-container button {
    width: fit-content;
    margin-top: 2rem;
    padding: 0.5rem 2rem;
  }

  .error {
    margin-top: 1rem;
    color: #f66;
    font-weight: bold;
  }
</style>
