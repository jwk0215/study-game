import toastStore from "$stores/toast.store";
import userStore from "$stores/user.store";




type MethodType = "GET" | "POST" | "PUT" | "DELETE";


export async function apiFetch(
    method: MethodType,
    api: string,
    body?: string,
    signal?: AbortSignal
) {
    const option: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body
    };

    if (signal) option.signal = signal;
    
    const res = await fetch(
        import.meta.env.VITE_APP_API + api,
        option
    );

    if (res.status !== 401) return res;

    const refresh = await fetch(
        import.meta.env.VITE_APP_API + "/login/refresh",
        {
            method: "POST",
            credentials: "include"
        }
    );

    if (!refresh.ok) {
        userStore.clearStore();
        toastStore.bake({
            type: "info",
            message: "로그인 만료"
        });
        return;
    }

    return await fetch(
        import.meta.env.VITE_APP_API + api,
        option
    );
}