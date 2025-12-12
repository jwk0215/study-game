import { writable } from "svelte/store";
import type { CharacterItemType } from "./characterItemShop.store";






type UserStoreType = {
    id: string;
    name: string;
    gem: number;
    item: {
        [key: string]: CharacterItemType[]
    }
}


function createUserStore() {
    const { subscribe, set, update } = writable<UserStoreType | null>(null);

    return {
        subscribe,
        setStore: (data: UserStoreType) => set(data),
        updateGem: (value: number) => {
            update(store => {
                if (!store) return store;
                
                store.gem += value;
                return store;
            });
        },
        updateItem: (slot: string, item: CharacterItemType) => {
            update(store => {
                if (!store) return store;

                store.item[slot].push(item);
                return store;
            })
        }
    }
}
export default createUserStore();