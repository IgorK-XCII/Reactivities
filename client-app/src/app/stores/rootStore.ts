import { createContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";

export class RootStore {
    activityStore: ActivityStore = new ActivityStore(this);
    userStore: UserStore = new UserStore(this);
    commonStore = new CommonStore(this);
    modalStore = new ModalStore(this);
}

export const rootStoreContext =  createContext(new RootStore());