<script lang="ts">
    import type { ActionData } from "./$types"
  import Login from '../../components/Login.svelte';
  import Register from '../../components/Register.svelte';
    export let form: ActionData;
    
  </script>
  

  <div class="center-items">
      <h1>Register</h1>
  
    
    {#if form?.user}
      <p >Username/Email is taken.</p>
      {:else if form?.user==null}
      <Register></Register>
      
      {:else}
      <p>Registration is successful.</p>
      <Login></Login>
    {/if}
  </div>