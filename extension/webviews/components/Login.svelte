<script lang="ts">
  export let onLogin: () => void;
</script>

<div class="login-container">
  <h1>Log in</h1>
  <h3>Welcome to VS-School</h3>
  <button on:click={onLogin}>Continue with VUT</button>
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
</style>
