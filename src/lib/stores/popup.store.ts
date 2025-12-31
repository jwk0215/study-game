import type { Component } from "svelte";
import { writable } from "svelte/store";





interface PopupStoreType {
    title: string;
    component: Component<any, any, any>;
    props?: {
        [key: string]: any
    };
}


function createPopupStore() {
    const { subscribe, set } = writable<PopupStoreType | null>(null);

    return {
        subscribe,
        open: (data: PopupStoreType) => set(data),
        close: () => set(null)
    }
}
export default createPopupStore();