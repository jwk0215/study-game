import { writable } from "svelte/store";





type UserKeyType = "id" | "nickname" | "gem" | "c_type" | "reg_data";

interface UserType {
    id: string;
    nickname: string;
    gem: number;
    c_type: string;
    reg_data?: string;
}


function createUserStore() {
    const { subscribe, set, update } = writable<UserType | null>();

    return {
        subscribe,
        setStore: (data: UserType) => {
            set(data);
        },
        updateStore: <K extends UserKeyType>(key: K, value: UserType[K]) => {
            update((store) => {
                if (store === null) return store;

                return {
                    ...store,
                    [key]: value
                };
            });
        },
        clearStore: () => set(null)
    }
}
export default createUserStore();