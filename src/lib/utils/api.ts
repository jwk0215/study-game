import toastStore from "$stores/toast.store";

type MethodType = "GET" | "POST" | "PUT" | "DELETE";



export async function apiFetch(
    method: MethodType,
    api: string,
    body: string,
    signal: AbortSignal | null = null
) {
    const option: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
        body
    };

    if (signal) option.signal = signal;
    
    return await fetch(
        import.meta.env.VITE_APP_API + api,
        option
    );
}