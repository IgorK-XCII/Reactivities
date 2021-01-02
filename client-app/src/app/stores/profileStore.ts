import { toast } from 'react-toastify';
import { IPhoto, IProfile } from './../models/profile';
import { action, makeObservable, observable, runInAction, computed } from "mobx";
import { RootStore } from "./rootStore";
import agent from '../api/agent';

export default class ProfileStore {
    constructor(private rootStore: RootStore) {
        makeObservable(this, {
            profile: observable,
            loadingProfile: observable,
            uploadingPhoto: observable,
            settingMainPhoto: observable,
            isCurrentUser: computed,
            loadProfile: action,
            uploadPhoto: action,
            setMainPhoto: action,
            deletePhoto: action
        })
    }

    profile: IProfile | null = null;
    loadingProfile = false;
    uploadingPhoto = false;
    settingMainPhoto = false;
    deletingPhoto = false;

    get isCurrentUser() {
        const currentUser = this.rootStore.userStore.user;
        if (currentUser && this.profile) {
            return currentUser.username === this.profile.username;
        } else {
            return false;
        }
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
            });
            console.log(error);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                this.profile?.photos.push(photo);
                if (photo.isMain && this.rootStore.userStore.user && this.profile) {
                    this.rootStore.userStore.user.image = photo.url;
                    this.profile.image = photo.url;
                }
                this.uploadingPhoto = false;
            });
        } catch (error) {
            runInAction(() => {
                this.uploadingPhoto = false;
            })
            toast.error('Problem upload photo');
            console.log(error);
        }
    }

    setMainPhoto = async (photo: IPhoto) => {
        this.settingMainPhoto = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                if (this.rootStore.userStore.user && this.profile) {
                    this.rootStore.userStore.user.image = photo.url;
                    this.profile.image = photo.url;
                    this.profile.photos.forEach((p) => {
                        if (p.id === photo.id) {
                            p.isMain = true;
                            return;
                        }
                        p.isMain = false;
                    })
                }
                this.settingMainPhoto = false;
            });
        } catch (error) {
            runInAction(() => {
                this.settingMainPhoto = false;
            });
            console.log(error);
        }
    }

    deletePhoto = async (photo: IPhoto) => {
        if (photo.isMain)
            return;

        this.deletingPhoto = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.rootStore.userStore.user && this.profile) {
                    const photos = this.profile.photos.filter(p => p.id !== photo.id);
                    this.profile.photos = photos;
                }
                this.deletingPhoto = false;
            });
        } catch (error) {
            runInAction(() => {
                this.deletingPhoto = false;
            });
            console.log(error);
        }
    }
}