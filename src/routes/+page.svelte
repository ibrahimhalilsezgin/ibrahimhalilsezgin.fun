<script lang="ts">
    import { blur, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';
    import { Accordion } from '@skeletonlabs/skeleton-svelte';

    import "../app.css"
    let show = false;
    let input = '';
    onMount(() => {
      show = true
    })
    const commands:any = {
        "whoami": "I am Ibrahim. I am 18 Years Old. I love backend development",
        "projects": "https://github.com/ibrahimhalilsezgin?tab=repositories",
        "github": "https://github.com/ibrahimhalilsezgin",
        "instagram": "https://www.instagram.com/ibrhmhl/",
        "linkedin": "https://www.linkedin.com/in/ibrahimhalilsezgin/",
        "node -v": "Node.js v22.15.1",
        "erenkarayilan":"?"

    }

    const executeCommand = () => {
  const container = document.getElementById('command-line');

  const oldInput = document.getElementById('command') as HTMLInputElement;
  if (oldInput) {
    oldInput.id = 'old-command';
    oldInput.disabled = true;
    oldInput.value = input; 
  }

  if (input.trim()) {
    if(input == "erenkarayilan"){
    const response = commands[input.trim()];
        const outputPre = document.createElement('pre');
        outputPre.setAttribute('data-prefix', '>');

        const outputCode = document.createElement('code');
        outputCode.textContent = response || `command not found: ${input}`;
        outputPre.appendChild(outputCode);
        container?.appendChild(outputPre);
        document.getElementById('eren')?.setAttribute('src', 'https://www.youtube.com/embed/HMMydN7Zv9o?autoplay=1&loop=1&start=15&playlist=HMMydN7Zv9o')

        }
        const response = commands[input.trim()];
        const outputPre = document.createElement('pre');
        outputPre.setAttribute('data-prefix', '>');

        const outputCode = document.createElement('code');
        outputCode.textContent = response || `command not found: ${input}`;
        outputPre.appendChild(outputCode);
        container?.appendChild(outputPre);
      }
      
  const pre = document.createElement('pre');
  pre.setAttribute('data-prefix', '$');

  const code = document.createElement('code');

  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.id = 'command';
  newInput.className = 'border border-transparent focus:outline-none focus:ring-0 font-mono w-full';
  newInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      input = (e.target as HTMLInputElement).value;
      executeCommand();
    }
  });

  code.appendChild(newInput);
  pre.appendChild(code);
  container?.appendChild(pre);
  newInput.focus();

  input = '';
};
    let c:any = [];
    for (let [key] of Object.entries(commands)) {
        c = [...c, key]
    }

</script>

<div class="grid grid-cols-[1fr_2fr_1fr] h-screen font-mono">
  <div class="flex items-center justify-center font-2xl border-r border-r-[#1a1a1ad5]">
  </div>

  {#if show}
    <div transition:blur={{ duration: 1200, amount: 300, opacity: 0, easing: cubicOut }} class="flex justify-center font-2xl items-center">
    <div class="">
      <div class="flex flex-col p-34"> 
        </div>
            <div class="flex flex-col p-28">
                <div class="mockup-code w-3xl " id="command-line">
                    <pre data-prefix="$"><code><input type="text" bind:value={input} class="border border-transparent focus:outline-none focus:ring-0 font-mono w-full" id="command" onkeypress={(e) => {if(e.key == "Enter") return executeCommand()}}></code></pre>
                </div>
            </div>
            <div class="mockup-browser border-base-300 border w-full">
                <div class="mockup-browser-toolbar">
                    <div class="input">https://ibrahimhalilsezgin.fun</div>
                </div>
                <div class="grid place-content-center border-t border-base-300 h-80">
                    <Accordion>
                        <Accordion.Item value="commands">
                            {#snippet lead()}|{/snippet}
                            {#snippet control()}Commands{/snippet}
                            {#snippet panel()}
                                <div class="flex flex-wrap gap-4 text-center">
                                    {#each c as command}
                                      <div
                                        class={`bg-white text-black rounded-xl transition-all cursor-pointer ${
                                          command.length >= 10 ? 'w-34 hover:w-38' : 'w-23 hover:w-26'
                                        }`}
                                      >
                                        {command}
                                      </div>
                                    {/each}
                                </div>
                            {/snippet}
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </div>
            <div class="flex items-center justify-center font-2xl border-l border-l-[#1a1a1ad5]"></div>
      
          <div>
        </div>
        
<iframe width="560" height="315"
id="eren"
  src=""
  frameborder="0"
  allow="autoplay; encrypted-media"
  allowfullscreen
  hidden>
</iframe>

      </div>


  {/if}


<!-- <iframe autoplay hidden width="560" height="315" src="https://www.youtube.com/embed/HMMydN7Zv9o?si=29OrR8k6ul-1ZY4u&amp;start=15" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>  </div> -->
</div>
