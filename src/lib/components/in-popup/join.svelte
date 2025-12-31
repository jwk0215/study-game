<script lang="ts">
    import popupStore from "$stores/popup.store";
    import toastStore from "$stores/toast.store";
    import { apiFetch } from "$utils/api";




    // props
    let { data } = $props();
    
    
    // input state type
    type InputStateType = "idle" | "impossible" | "duplicated" | "available";


    // state & element
    let pwInputEl = $state<HTMLInputElement>();
    let pwCheckInputEl = $state<HTMLInputElement>();
    let pwState = $state<"password" | "text">("password");
    let pwCheckState = $state<"password" | "text">("password");

    let inputValue = $state<{[key: string]: string}>({
        "nickname": "",
        "id": "",
        "pw": "",
    });
    let inputState = $state<{[key:string]: InputStateType}>({
        "nickname": "idle",
        "id": "idle",
        "pw": "idle",
        "pwCheck": "idle"
    });
    let joinState = $derived.by(() => {
        for (const key of Object.keys(inputState)) {
            if (inputState[key] !== "available") return false;
        }

        for (const key of Object.keys(inputValue)) {
            if (inputValue[key].length <= 0) return false;
        }

        return true;
    });


    // for debounce
    let delay = 300;
    let timer: any;
    let controller: AbortController | null = null;


    /**
     * 중복 체크가 필요한 항목을 위한 oninput evt
     * @param e Event
     * @param type string
     */
    function onInput(e: Event, type: string, api: string) {
        if (timer) clearTimeout(timer);
        const value = (e.target as HTMLInputElement).value;
        const reg1 = /^[a-zA-Z0-9]{6,16}$/;
        const reg2 = /^[a-zA-Z0-9가-힣]{2,10}$/;

        if (value.length < 1) {
            inputValue[type] = '';
            inputState[type] = "idle";
            return;
        }
        
        if (
            (type === "id" && !reg1.test(value)) ||
            (type === "nickname" && !reg2.test(value))
        ) {
            inputValue[type] = '';
            inputState[type] = "impossible";
            return;
        }

        if (value === inputValue[type]) return;

        timer = setTimeout(async () => {
            controller?.abort();
            controller = new AbortController();

            const res = await apiFetch(
                "POST",
                api,
                JSON.stringify({ value }),
                controller.signal
            );

            if (!res.ok) return;
            const result = await res.json();

            if (result.data.available) {
                inputValue[type] = result.data.value;
                inputState[type] = "available";
            } else {
                inputState[type] = "duplicated";
            }
        }, delay);
    }


    /**
     * pw oninput
     * @param e Event
     */
    function pwOninput(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;

        if (value.length < 1) {
            inputValue["pw"] = '';
            inputState["pw"] = "idle";
            return;
        }
        
        if (reg.test(value)) {
            inputValue["pw"] = value;
            inputState["pw"] = "available";
        } else {
            inputValue["pw"] = '';
            inputState["pw"] = "impossible";
        }
    }


    /**
     * pw check oninput
     * @param e Event
     */
    function pwCheckOninput(e: Event) {
        const value = (e.target as HTMLInputElement).value;

        if (value.length < 1) {
            inputState["pwCheck"] = "idle";
            return;
        }

        if (value === inputValue["pw"]) inputState["pwCheck"] = "available";
        else inputState["pwCheck"] = "impossible";
    }


    /**
     * submit event
     * @param e SubmitEvent
     */
    async function join(e: SubmitEvent) {
        const data = JSON.stringify(inputValue);

        const res = await apiFetch(
            "POST",
            "/join",
            data
        );
        const result = await res.json();

        if (!res.ok) {
            toastStore.bake({
                type: "warning",
                message: result.message
            });
            return;
        }

        popupStore.close();
        toastStore.bake({
            type: "success",
            message: "회원가입이 완료되었습니다."
        });
    }


    /**
     * pw view on/off evt
     * @param type "pw" | "pwCheck"
     */
    function pwViewEvt(type: "pw" | "pwCheck") {
        if (type === "pw") {
            pwState = pwState === "password" ? "text" : "password";
        } else {
            pwCheckState = pwCheckState === "password" ? "text" : "password";
        }
    }
</script>



{#snippet pwViewBtn(type: "pw" | "pwCheck", state: "password" | "text")}
<button type="button" class="view-btn" aria-label="password view on/off" onclick={() => pwViewEvt(type)}>
    {#if state === "password"}
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9202 12.7988C15.9725 12.5407 16 12.2736 16 12C16 9.79086 14.2091 8 12 8C11.7264 8 11.4593 8.02746 11.2012 8.07977L15.9202 12.7988ZM8.66676 9.78799C8.24547 10.4216 8 11.1821 8 12C8 14.2091 9.79086 16 12 16C12.8179 16 13.5784 15.7545 14.212 15.3332L12.7381 13.8594C12.5098 13.9501 12.2607 14 12 14C10.8954 14 10 13.1046 10 12C10 11.7393 10.0499 11.4902 10.1406 11.2619L8.66676 9.78799Z" fill="#FFB703"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5191 17.6405L15.0499 16.1712C14.0776 16.6805 13.0477 17 12 17C10.4742 17 8.98616 16.3224 7.65914 15.3677C6.34002 14.4186 5.26409 13.2558 4.58386 12.43C4.48409 12.3088 4.40958 12.2182 4.34785 12.1385C4.29899 12.0754 4.26786 12.0315 4.24756 12C4.26786 11.9685 4.29899 11.9246 4.34785 11.8615C4.40958 11.7818 4.48409 11.6912 4.58386 11.57C5.24928 10.7622 6.29335 9.63187 7.57331 8.69463L6.14458 7.2659C4.79643 8.29616 3.72247 9.47005 3.04009 10.2985C3.01651 10.3272 2.99192 10.3566 2.96662 10.3869L2.96661 10.3869C2.65318 10.7624 2.22974 11.2696 2.22974 12C2.22974 12.7304 2.65318 13.2376 2.9666 13.6131L2.96682 13.6133C2.99205 13.6435 3.01657 13.6729 3.04009 13.7015C3.77996 14.5998 4.98018 15.9041 6.49111 16.9912C7.99416 18.0725 9.89008 19 12 19C13.67 19 15.206 18.419 16.5191 17.6405ZM8.80682 5.6855C9.79062 5.26871 10.8643 5 12 5C14.1099 5 16.0059 5.92747 17.5089 7.00885C19.0198 8.0959 20.2201 9.40025 20.9599 10.2985C20.9835 10.3272 21.0081 10.3566 21.0334 10.3869L21.0334 10.3869C21.3468 10.7624 21.7703 11.2696 21.7703 12C21.7703 12.7304 21.3468 13.2376 21.0334 13.6131C21.0081 13.6434 20.9835 13.6728 20.9599 13.7015C20.4733 14.2923 19.7874 15.0589 18.945 15.8237L17.529 14.4077C18.3089 13.708 18.9539 12.9912 19.4162 12.43C19.5159 12.3088 19.5904 12.2182 19.6522 12.1385C19.701 12.0754 19.7322 12.0315 19.7525 12C19.7322 11.9685 19.701 11.9246 19.6522 11.8615C19.5904 11.7818 19.5159 11.6912 19.4162 11.57C18.7359 10.7442 17.66 9.58138 16.3409 8.63233C15.0139 7.6776 13.5258 7 12 7C11.449 7 10.9029 7.08837 10.3676 7.24624L8.80682 5.6855Z" fill="#FFB703"></path> <path d="M5 2L21 18" stroke="#FFB703" stroke-width="2"></path> </g></svg>
    {:else}
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="3" stroke="#FFB703" stroke-width="2"></circle> <path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="#FFB703" stroke-width="2"></path> </g></svg>
    {/if}
</button>
{/snippet}

<form id="join-form" onsubmit={join}>
    <ul id="step-wrapper">
        <li class="step">
            <div class="input-wrapper">
                <p class="input-info">
                    닉네임 입력

                    {#if inputState["nickname"] !== "idle"}
                    <span class="check" class:available={inputState["nickname"] === "available"}>
                        {
                            inputState["nickname"] === "available" ? 
                            "사용 가능한 닉네임" : inputState["nickname"] === "duplicated" ?
                            "중복된 닉네임" : "한글, 영문, 숫자만 가능(2~10글자)"
                        }
                    </span>
                    {/if}
                </p>
                <input class="input" placeholder="NICKNAME" type="text"
                oninput={(e) => onInput(e, "nickname", "/join/ch-nick")}>
            </div>

            <div class="input-wrapper">
                <p class="input-info">
                    아이디 입력

                    {#if inputState["id"] !== "idle"}
                    <span class="check" class:available={inputState["id"] === "available"}>
                        {
                            inputState["id"] === "available" ? 
                            "사용 가능한 아이디" : inputState["id"] === "duplicated" ?
                            "중복된 아이디" : "영문, 숫자만 가능(6~16글자)"
                        }
                    </span>
                    {/if}
                </p>
                <input class="input" placeholder="ID" type="text"
                oninput={(e) => onInput(e, "id", "/join/ch-id")}>
            </div>
            
            <div class="input-wrapper">
                <p class="input-info">
                    비밀번호 입력

                    {#if inputState["pw"] !== "idle"}
                    <span class="check" class:available={inputState["pw"] === "available"}>
                        {
                            inputState["pw"] === "available" ?
                            "사용 가능한 비밀번호" : "영문, 숫자, 특수문자 모두 포함(8~20글자)"
                        }
                    </span>
                    {/if}
                </p>
                <input class="input" placeholder="PW" type="{pwState}" oninput={pwOninput} bind:this={pwInputEl}>
                {@render pwViewBtn("pw", pwState)}
            </div>
            
            <div class="input-wrapper">
                <p class="input-info">
                    비밀번호 확인

                    {#if inputState["pwCheck"] !== "idle"}
                    <span class="check" class:available={inputState["pwCheck"] === "available"}>
                        {
                            inputState["pw"] !== "available" ?
                            "비밀번호 미설정" : inputState["pwCheck"] === "available" ?
                            "일치" : "불일치"
                        }
                    </span>
                    {/if}
                </p>
                <input class="input" placeholder="PW 확인" type="{pwCheckState}" oninput={pwCheckOninput} bind:this={pwCheckInputEl}>
                {@render pwViewBtn("pwCheck", pwCheckState)}
            </div>

            <button class="step-btn" class:on={joinState} type="submit">
                회원가입
            </button>
        </li>
    </ul>
</form>



<style>
    #join-form {
        position: relative;
        width: 35rem;
        height: 40rem;
    }


    #step-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        display: flex;


        & .step {
            flex: 1;
            height: 100%;
            flex-shrink: 0;
            background-color: var(--color-background);
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }


        & .step-btn {
            margin-top: auto;
            width: 100%;
            height: 4.5rem;
            border: 0.2rem solid var(--color-border);
            border-radius: 9999px;
            background-color: var(--color-main);
            font-size: 1.6rem;
            font-weight: bold;
            filter: grayscale(1);
            pointer-events: none;
        }
        & .step-btn.on {
            pointer-events: all;
            filter: grayscale(0);
        }
    }


    .input-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.7rem;


        & .input-info {
            position: relative;
            font-size: 1.5rem;


            & .check {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                color: var(--color-fail);
                font-size: 1.4rem;
            }
            & .check.available {
                color: var(--color-success);
            }
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


        & .view-btn {
            position: absolute;
            right: 1.5rem;
            bottom: calc(4.5rem / 2);
            transform: translateY(50%);
            width: 2.2rem;
            aspect-ratio: 1;
        }
    }
</style>