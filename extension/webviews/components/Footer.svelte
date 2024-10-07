<script lang="ts">
  export let name: string = "";
  export let onLogout: () => void;
</script>

<footer class="footer">
  <h3>{name}</h3>
  <button on:click={onLogout} class="logout-btn">Log out</button>
</footer>

<style>
  .footer {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
  .logout-btn {
    width: fit-content;
    padding: 0.5rem 1rem;
  }
  .footer {
    margin-top: auto; /* Push the footer to the bottom */
    text-align: center;
    padding-bottom: 2rem;
  }
</style>
