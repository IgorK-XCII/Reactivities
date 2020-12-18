import { action, observable, makeObservable, computed, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";


class ActivityStore {
    constructor() {
        makeObservable(this, {
            activities: observable,
            activityRegistry: observable,
            activity: observable,
            loadingInitial: observable,
            editMode: observable,
            submitting: observable,
            target: observable,
            activitiesByDate: computed,
            loadActivities: action,
            selectActivity: action,
            createActivity: action,
            openCreateForm: action,
            editActivity: action,
            setEditMode: action,
            loadActivity: action
        });
    };

    activities: IActivity[] = [];
    activityRegistry = new Map();
    activity: IActivity | null = null;
    loadingInitial = false;
    editMode = false;
    submitting = false;
    target = '';

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    };

    getActivity = (id: string) => this.activityRegistry.get(id);

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const acts = await agent.Activities.list();
            runInAction(() => {
                acts.forEach((act: IActivity): void => {
                    act.date = act.date.split('.')[0];
                    this.activityRegistry.set(act.id, act);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            });
            console.log(error);
        };
    };

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        } else {
            try {
                this.loadingInitial = true;
                this.activity = await agent.Activities.details(id);
                runInAction(() => {
                    this.loadingInitial = false;
                });
            } catch (error) {
                runInAction(() => {
                    this.loadingInitial = true;
                });
                console.log(error);
            }
        }
    };

    selectActivity = (id: string | null) => {
        this.activity = this.activityRegistry.get(id) || null;
        this.editMode = false;
    };

    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectActivity(activity.id);
                this.submitting = false;
            });

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            console.log(error);
        }
    };

    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.edit(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectActivity(activity.id);
                this.submitting = false;
            });
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            console.log(error);
        }
    };

    deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        try {
            this.target = event.currentTarget.name;
            await agent.Activities.remove(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.selectActivity(null);
                this.target = '';
                this.submitting = false;
            });
        } catch (error) {
            runInAction(() => {
                this.target = '';
                this.submitting = false;
            });
            console.log(error);
        }
    };

    openCreateForm = () => {
        this.editMode = true;
        this.activity = null;
    };

    setEditMode = (mode: boolean) => {
        this.editMode = mode;
    };
};

export default createContext(new ActivityStore());
