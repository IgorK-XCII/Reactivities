import { history } from './../../index';
import { RootStore } from './rootStore';
import { IUserFormValues } from './../models/user';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { IUser } from '../models/user';
import agent from '../api/agent';

export default class UserStore {
    constructor(private rootStore: RootStore) {
        makeObservable(this, {
            user: observable,
            isLogIn: computed,
            login: action,
            getUser: action,
            logout: action,
        })
    }

    user: IUser | null = null;

    get isLogIn() {
        return !!this.user;
    }

    login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });
        } catch (error) {
            console.log(error);
        }
    }

    logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    register = async (values: IUserFormValues ) => {
        try {
            const user = await agent.User.register(values);
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }
}

