<script lang="ts">
    import loadingStore from "$stores/loading.store";
    import popupStore from "$stores/popup.store";
    import toastStore from "$stores/toast.store";
    import userStore from "$stores/user.store";
    import { apiFetch } from "$utils/api";
    import Find from "./in-popup/find.svelte";
    import Join from "./in-popup/join.svelte";




    // state
    let idValue = $state('');
    let pwValue = $state('');
    let loginState = $derived.by(() => {
        if (idValue.trim().length <= 0 || pwValue.trim().length <= 0) return false;
        return true;
    });
    
    
    /**
     * login event
     * @param e SubmitEvent
     */
    async function login(e: SubmitEvent) {
        const res = await apiFetch(
            "POST",
            "/login",
            JSON.stringify({
                id: idValue,
                pw: pwValue
            })
        );
        const result = await res?.json();

        idValue = '';
        pwValue = '';

        if (!res?.ok) {
            toastStore.bake({
                type: "warning",
                message: result.message
            });
            return;
        }

        loadingStore.on();
        userStore.setStore(result.data.user);
    }


    /**
     * find open
     */
    function find() {
        popupStore.open({
            title: "ID/PW 찾기",
            component: Find
        });
    }


    /**
     * join open
     */
    function join() {
        popupStore.open({
            title: "회원가입",
            component: Join
        });
    }
</script>



<div id="login-page">
    <form id="login-form" onsubmit={login}>
        <h2 id="title">
            UnTitle.
        </h2>
        
        <input class="input" placeholder="ID" type="text" bind:value={idValue}>
        <input class="input" placeholder="PW" type="password" bind:value={pwValue}>

        <button id="login-btn" class:on={loginState} type="submit">
            로그인
        </button>

        <div id="info-wrapper">
            <button id="find-btn" class="info-btn" type="button" onclick={find}>
                ID/PW 찾기
            </button>

            <button id="join-btn" class="info-btn" type="button" onclick={join}>
                회원가입
            </button>
        </div>
    </form>
</div>



<style>
    #login-page {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }


    #login-form {
        width: 30rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;


        & #title {
            font-size: 3.2rem;
            font-weight: bold;
            color: var(--color-main);
            height: 4rem;
        }


        & .input {
            width: 100%;
            height: 4.5rem;
            border: 0.2rem solid var(--color-disabled-border);
            border-radius: 9999px;
            padding: 1rem 2rem;
            font-size: 1.6rem;
        }
        & .input::placeholder {
            color: var(--color-disabled-text);
        }
        & .input:focus {
            border-color: var(--color-border);
        }


        & #login-btn {
            width: 100%;
            height: 4.5rem;
            font-size: 1.6rem;
            font-weight: bold;
            color: var(--color-title);
            border-radius: 9999px;
            border: 0.2rem solid var(--color-border);
            background-color: var(--color-main);
            pointer-events: none;
            filter: grayscale(1);
        }
        & #login-btn.on {
            pointer-events: all;
            filter: grayscale(0);
        }


        & #info-wrapper {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 2rem;
            margin-top: 1rem;


            & .info-btn {
                font-size: 1.5rem;
                text-decoration: underline;
            }
        }
    }
</style>