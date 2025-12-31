import { writable } from "svelte/store";





interface ToastStoreType {
    type: "info" | "warning" | "success";
    message: string;
}


function createToastStore() {
    const { subscribe, set, update } = writable<Record<number, ToastStoreType>>({});

    return {
        subscribe,
        bake: (data: ToastStoreType) => {
            const now = Date.now();

            update(current => {
                if (current[now]) return current;

                setTimeout(() => {
                    update(prev => {
                        const { [now]: _, ...store } = prev;
                        return store;
                    });
                }, 3000);

                return {...current, [now]: data};
            });
        }
    }
}
export default createToastStore();