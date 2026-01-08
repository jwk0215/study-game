<script lang="ts">
    import loadingStore from "$stores/loading.store";
    import toastStore from "$stores/toast.store";
    import { apiFetch } from "$utils/api";
    import { userData } from "three/src/nodes/TSL.js";
    import Three from "./three.svelte";
    import userStore from "$stores/user.store";
    
    
    
    
    // state
    let loadState = $state({ male: false, female: false });
    let cTypeState = $state<'' | "male" | "female">('');
    let maleState = $derived.by(() => { return cTypeState === "male" });
    let femaleState = $derived.by(() => { return cTypeState === "female" });


    /**
     * male state setter
     * @param state boolean
     */
    function setMaleLoadState(state: boolean) { loadState.male = state; }
    

    /**
     * female state setter
     * @param state boolean
     */
    function setFemaleLoadState(state: boolean) { loadState.female = state; }
    
    
    /**
     * character state setter
     * @param type "male" | "female"
     */
    function setCTypeState(type: "male" | "female") { cTypeState = type; };


    /**
     * 캐릭터 적용
     */
    async function apply() {
        if (cTypeState === '') return;
        loadingStore.on();
        
        const res = await apiFetch(
            "POST",
            "/user/r-c-gender",
            JSON.stringify({ c_gender: cTypeState })
        );

        if (!res?.ok) {
            loadingStore.off();
            toastStore.bake({
                type: "warning",
                message: "잠시 후 다시 시도해주세요."
            });
            return;
        }

        const result = await res.json();
        userStore.updateStore("c_type", result.data.c_type);
    }


    /**
     * effect()
     * 로딩화면 내리기
    */
    $effect(() => {
        if (loadState.male && loadState.female) {
            loadingStore.off();
        }
    });
</script>



<div id="character-choice-page">
    <div id="info">
        <h1 id="title">캐릭터 선택</h1>
        <p id="txt">원하는 캐릭터를 선택한 뒤 우측에 있는 완료버튼을 누르고 시작해보세요!</p>

        <button id="apply-btn" class:on={cTypeState !== ''} onclick={apply}>
            선택완료
        </button>
    </div>

    <div id="character-brn-wrapper">
        <button id="male" class="character-btn" class:on={cTypeState === "male"}
        onclick={() => setCTypeState("male")}>
            <Three props={{
                path: "/assets/glb/male.glb",
                position: {x: 0, y: 2, z: 4},
                looAt: {x: 0, y: 1, z: 0},
                state: maleState,
                setLoadState: setMaleLoadState
            }} />
        </button>
    
        <button id="female" class="character-btn" class:on={cTypeState === "female"}
        onclick={() => setCTypeState("female")}>
            <Three props={{
                path: "/assets/glb/female.glb",
                position: {x: 0, y: 1.5, z: 3},
                looAt: {x: 0, y: 0.8, z: 0},
                state: femaleState,
                setLoadState: setFemaleLoadState
            }} />
        </button>
    </div>
</div>



<style>
    #character-choice-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 3rem 0 5rem 0;
    }


    #info {
        position: relative;
        flex: 1;
        width: 100%;
        padding: 0 5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;


        & #title {
            font-size: 2.4rem;
            font-weight: bold;
        }


        & #txt {
            font-size: 1.8rem;
        }


        & #apply-btn {
            position: absolute;
            top: 50%;
            right: 5rem;
            transform: translateY(-50%);
            padding: 1.2rem 3rem;
            font-size: 1.8rem;
            font-weight: bold;
            background-color: var(--color-main);
            border: 0.2rem solid var(--color-border);
            border-radius: 9999px;
            pointer-events: none;
            filter: grayscale(1);
        }
        & #apply-btn.on {
            pointer-events: all;
            filter: grayscale(0);
        }
    }


    #character-brn-wrapper {
        position: relative;
        width: 100%;
        height: 55rem;
        display: flex;

        &::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            width: 0.3rem;
            height: 100%;
            transform: translateX(-50%);
            background-color: var(--color-sub);
        }
    
    
        & .character-btn {
            flex: 1;
            height: 100%;
            filter: grayscale(1);
        }
        & .character-btn.on {
            filter: grayscale(0);
        }
    }
</style>