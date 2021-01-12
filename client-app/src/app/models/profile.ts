export interface IProfile {
    displayName: string;
    username: string;
    bio: string;
    image: string;
    following: boolean;
    followersCount: number;
    followingCount: number;
    photos: IPhoto[];
}

export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
}

export interface IDescription {
    displayName: string;
    bio: string;
}

export enum Predicate {
    Followers = 'followers',
    Following = 'following'
}