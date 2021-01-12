import { toast } from 'react-toastify';
import { IDescription, IPhoto, IProfile, Predicate } from './../models/profile';
import { action, makeObservable, observable, runInAction, computed, reaction } from "mobx";
import { RootStore } from "./rootStore";
import agent from '../api/agent';

export default class ProfileStore {
    constructor(private rootStore: RootStore) {
        makeObservable(this, {
            profile: observable,
            loadingProfile: observable,
            uploadingPhoto: observable,
            settingMainPhoto: observable,
            editingDescription: observable,
            loading: observable,
            followings: observable,
            activeTab: observable,
            isCurrentUser: computed,
            loadProfile: action,
            uploadPhoto: action,
            setMainPhoto: action,
            deletePhoto: action,
            editDescription: action,
            follow: action,
            unfollow: action,
            loadFollowings: action,
            setActiveTab: action,
        })

        reaction(() => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? Predicate.Followers : Predicate.Following;
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    profile: IProfile | null = null;
    loadingProfile = false;
    uploadingPhoto = false;
    settingMainPhoto = false;
    deletingPhoto = false;
    editingDescription = false;
    loading = false;
    followings: IProfile[] = [];
    activeTab: number = 0;

    get isCurrentUser() {
        const currentUser = this.rootStore.userStore.user;
        if (currentUser && this.profile) {
            return currentUser.username === this.profile.username;
        } else {
            return false;
        }
    }

    setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        this.followings = [];
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
                    this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
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

    editDescription = async (description: IDescription) => {
        this.editingDescription = true;
        const { displayName, bio } = description;
        try {
            await agent.Profiles.editDescription(description);
            runInAction(() => {
                if (this.rootStore.userStore.user && this.profile) {

                    this.profile.displayName = displayName;
                    this.profile.bio = bio;
                    this.rootStore.userStore.user.displayName = displayName;
                }
                this.editingDescription = false;
            });
        } catch (error) {
            runInAction(() => {
                this.editingDescription = false;
            });
            console.log(error);
            toast.error('Cannot edit profile description');
        }
    }

    follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction(() => {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem following user');
        }
    }

    unfollow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.unfollow(username);
            runInAction(() => {
                this.profile!.following = false;
                this.profile!.followersCount--;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem unfollowing user');
        }
    }

    loadFollowings = async (predicate: Predicate) => {
        this.loading = true;
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = profiles;
                this.loading = false;
            });
        } catch (error) {
            toast.error('Problem load followings');
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}