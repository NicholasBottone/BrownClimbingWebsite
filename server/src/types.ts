// types for BasicUser Model
export type BasicUserType = {
    googleId: string;
    displayName: string;
    displayPictureURL: string;
};

// types for User Model
export type UserType = {
    _id?: string;
    googleId: string;
    displayName: string;
    email: string;
    displayPictureURL: string;
    memberSince?: Date;
    lastLogin?: Date;
    moderator?: boolean; // TODO Implement moderator
};

// types for Event Model
export type EventType = {
    _id: string;
    eventTitle: string;
    description: string;
    hostUser: BasicUserType;
    location: string;
    startTime: Date;
    durationMinutes: number;
    transportInfo: string;
    registeredUsers: BasicUserType[];
    maxCapacity: number;
};
