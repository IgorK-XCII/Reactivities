import { RootStore } from './rootStore';
import { action, observable, makeObservable, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { createAttendee, setActivityProps } from '../util/util';

interface IActivityAcc {
    [key: string]: IActivity[]
};

export default class ActivityStore {
    constructor(private rootStore: RootStore) {
        makeObservable(this, {
            activityRegistry: observable,
            activity: observable,
            loadingInitial: observable,
            editMode: observable,
            submitting: observable,
            target: observable,
            loading: observable,
            activitiesByDate: computed,
            loadActivities: action,
            selectActivity: action,
            createActivity: action,
            openCreateForm: action,
            editActivity: action,
            setEditMode: action,
            loadActivity: action,
            attendActivity: action,
            unattendActivity: action
        });
    };

    activityRegistry = new Map();
    activity: IActivity | null = null;
    loadingInitial = false;
    editMode = false;
    submitting = false;
    target = '';
    loading = false;

    get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    };

    groupActivitiesByDate = (activities: IActivity[]) => {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
        return Object.entries(sortedActivities.reduce(
            (acc: IActivityAcc, act) => {
                const date = format(new Date(act.date), 'eeee do MMMM');
                acc[date] = acc[date] ? [...acc[date], act] : [act];
                return acc;
            }, {}
        ));
    };

    getActivity = (id: string) => this.activityRegistry.get(id);

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const acts = await agent.Activities.list();
            runInAction(() => {
                acts.forEach((act: IActivity): void => {
                    setActivityProps(act, this.rootStore.userStore.user!);
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
            return this.activity;
        } else {
            try {
                this.loadingInitial = true;
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;;
                    this.loadingInitial = false;
                });
                return this.activity;
            } catch (error) {
                runInAction(() => {
                    this.loadingInitial = false;
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
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            activity.isHost = true;
            activity.attendees = [attendee];
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectActivity(activity.id);
                this.submitting = false;
            });
            return true;
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error.response.data);
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
            return true;
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
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

    attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem signing up to activity')
            console.log(error);
        }
    }

    unattendActivity = async () => {
        this.loading = true;
        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(a => a.username !== this.rootStore.userStore.user?.username);
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            });

        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem cancel attendance');
            console.log(error);
        }
    }
};

