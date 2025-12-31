import { writable } from "svelte/store";





interface UserType {

}


function createUserStore() {
    const { subscribe, set, update } = writable<UserType | null>();

    return {
        subscribe,
        setStore: (data: UserType) => {
            set(data);
        }
    }
}
export default createUserStore();