<script lang="ts">
    import popupStore from "$stores/popup.store";
    import { fade, fly } from "svelte/transition";




    /**
     * close
     */
    function close() {
        popupStore.close();
    }
</script>


{#if $popupStore}
{@const Content = $popupStore.component}
<div id="popup-background" transition:fade={{duration: 300}}>
    <div id="popup" transition:fly={{x: 0, y: 50, duration: 300}}>
        <div id="popup-content">
            <h2 id="popup-title">
                {$popupStore.title}
            </h2>
            
            <!-- popup의 자식 컴포넌트는 props를 data로 정의해서 사용할 것 -->
            <!-- let { data } = props() 이 형식으로 선언해서 사용 -->
            <Content data={$popupStore.props}/>
        </div>

        <button id="close-btn" onclick={close} aria-label="popup close">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#FFB703"></path> </g></svg>
        </button>
    </div>
</div>
{/if}


<style>
    #popup-background {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1000;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }


    #popup {
        position: relative;
        padding: 3rem;
        background-color: var(--color-background);
        border-radius: 2rem;
        border: 0.2rem solid var(--color-border);
        overflow: visible;


        & #popup-content {
            width: fit-content;
            height: fit-content;
            display: flex;
            flex-direction: column;
            gap: 3rem;


            & #popup-title {
                display: flex;
                align-items: center;
                height: 3.5rem;
                font-size: 2rem;
                font-weight: bold;
                color: var(--color-main);
            }
        }


        & #close-btn {
            position: absolute;
            right: 3rem;
            top: 3rem;
            width: 3.5rem;
            aspect-ratio: 1;
            font-size: 1.6rem;
            font-weight: bold;
            border-radius: 9999px;
            cursor: pointer;
        }
    }
</style>