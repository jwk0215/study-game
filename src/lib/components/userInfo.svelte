<script lang="ts">
    import userStore from "$stores/user.store";
    import gemIcon from "$assets/images/gem-icon.png";
    import { apiFetch } from "$utils/api";
    import toastStore from "$stores/toast.store";




    /**
     * logout
     */
    async function logout() {
        const res = await apiFetch("POST", "/logout");
        
        if (!res?.ok) {
            toastStore.bake({
                type: "warning",
                message: "잠시 후 다시 시도해주세요."
            });
            return;
        }
        
        userStore.clearStore();
        toastStore.bake({
            type: "info",
            message: "로그아웃이 완료되었습니다."
        });
    }
</script>


<div id="user-info">
    <span id="nickname">
        닉네임: {$userStore?.nickname}
    </span>

    <div id="gem">
        <img src="{gemIcon}" alt="icon">: {$userStore?.gem}
    </div>

    <!-- <button id="logout" onclick={logout}>
        로그아웃
    </button> -->
</div>


<style>
    #user-info {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 5rem;
        padding: 0 8rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 2rem;
    }


    #nickname {
        font-weight: bold;
        font-size: 1.7rem;
    }
    
    
    #gem {
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 1.7rem;


        & img {
            width: 2.7rem;
            aspect-ratio: 1;
        }
    }


    /* #logout {
        margin-left: auto;
        padding: 0.7rem 2rem;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--color-title);
        border-radius: 9999px;
        border: 0.2rem solid var(--color-border);
        background-color: var(--color-main);
    } */
</style>