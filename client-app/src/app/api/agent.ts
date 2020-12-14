import { IActivity } from './../models/activity';
import axios, { AxiosResponse } from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => 
    (response: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const request = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
};

export const Activities = {
    list: (): Promise<IActivity[]> => request.get('/activities'),
    details: (id: string): Promise<IActivity> => request.get(`/activities/${id}`),
    create: (activity: IActivity) => request.post('/activities', activity),
    edit: (activity: IActivity) => request.put('/activities', activity),
    remove: (id: string) => request.del(`/activities/${id}`)
};

const agent = {
    Activities
};

export default agent;