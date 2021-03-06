import { IPhoto, IDescription, Predicate } from './../models/profile';
import { IUserFormValues } from './../models/user';
import { history } from './../../index';
import { IActivity } from './../models/activity';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { IUser } from '../models/user';
import { IProfile } from '../models/profile';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => Promise.reject(error));

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Oops! Something happened with connection');
    }
    const { status, data, config } = error.response;

    if (status === 404) {
        history.push('/notfound');
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }
    if (status === 500) {
        toast.error('Oops! Server is dying!');
    }
    throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) =>
    (response: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const request = {
    get: (url: string) => axios.get(url).then(sleep(200)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(500)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(500)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(500)).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(responseBody);
    },
};

export const Activities = {
    list: (): Promise<IActivity[]> => request.get('/activities'),
    details: (id: string): Promise<IActivity> => request.get(`/activities/${id}`),
    create: (activity: IActivity) => request.post('/activities', activity),
    edit: (activity: IActivity) => request.put(`/activities/${activity.id}`, activity),
    remove: (id: string) => request.del(`/activities/${id}`),
    attend: (id: string): Promise<void> => request.post(`/activities/${id}/attend`, {}),
    unattend: (id: string): Promise<void> => request.del(`/activities/${id}/attend`),
};

const User = {
    current: (): Promise<IUser> => request.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => request.post('/user/login', user),
    register: (user: IUserFormValues): Promise<IUser> => request.post('/user/register', user),
}

const Profiles = {
    get: (username: string): Promise<IProfile> => request.get(`/profiles/${username}`),
    editDescription: (description: IDescription): Promise<void> => request.put('/profiles/', description),
    uploadPhoto: (photo: Blob): Promise<IPhoto> => request.postForm('/photos', photo),
    setMainPhoto: (photoId: string): Promise<void> => request.post(`/photos/${photoId}/setmain`, {}),
    deletePhoto: (photoId: string): Promise<void> => request.del(`/photos/${photoId}`),
    follow: (username: string): Promise<void> => request.post(`/profiles/${username}/follow`, {}),
    unfollow: (username: string): Promise<void> => request.del(`/profiles/${username}/follow`),
    listFollowings: (username: string, predicate: Predicate): Promise<IProfile[]> => request.get(`/profiles/${username}/follow?predicate=${predicate}`)
}

const agent = {
    Activities,
    User,
    Profiles
};

export default agent;