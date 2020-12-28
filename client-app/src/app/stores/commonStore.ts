import { action, makeObservable, observable, reaction } from "mobx";
import { RootStore } from "./rootStore";

export default class CommonStore {
    constructor(private rootStore: RootStore) {
        makeObservable(this, {
            token: observable,
            appLoaded: observable,
            setToken: action,
            setAppLoaded: action
        })

        reaction(
            () => this.token,
            token => {
                token ? window.localStorage.setItem('jwt', token) : window.localStorage.removeItem('jwt');
            }
        )
    }

    token: string | null = window.localStorage.getItem('jwt');
    appLoaded = false;

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}