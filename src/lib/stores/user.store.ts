import { writable } from "svelte/store";





interface UserType {
    nickname: string;
}


function createUserStore() {
    const { subscribe, set, update } = writable<UserType | null>();

    return {
        subscribe,
        setStore: (data: UserType) => {
            set(data);
        },
        clearStore: () => set(null)
    }
}
export default createUserStore();