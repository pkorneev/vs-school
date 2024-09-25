<script lang="ts">
    let showPassword: boolean = false;
    let isTrue: boolean = tsvscode.getState()?.isTrue || false;
    $: {
        tsvscode.setState({isTrue});
    }
    const submitHandler = (e: Event) => {
        e.preventDefault();
        console.log('Login button click');
    }
</script>

<style>
    .password-input, .email-input, .login-button {
        margin: 0;
        margin-top: 1rem;
    }
    .show-password-checkbox {
        cursor: pointer;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: end;
        user-select: none;
    }
</style>

<h1>Testing stateManager</h1>
{#if isTrue}
    <h2>IT IS TRUE</h2>
{:else}
    <h2>IT IS FALSE</h2>
{/if}
<button on:click={()=> isTrue = !isTrue}>Change isTrue</button>

<form>
    <input class='email-input' type="text" placeholder="Enter your email" />
    
    <input class='password-input' type={showPassword ? "text" : "password"} placeholder="Enter your password" />
    
    <label class="show-password-checkbox">
        Show Password
        <input type="checkbox" bind:checked={showPassword} />
    </label>

    <button class='login-button' on:click={submitHandler}>Log in</button>
</form>