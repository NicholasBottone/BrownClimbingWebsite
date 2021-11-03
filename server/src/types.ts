// types for User Model
export type UserType = {
    _id?: string;
    googleId: string;
    displayName: string;
    email: string;
    displayPictureURL: string;
    memberSince?: Date;
    lastLogin?: Date;
    moderator?: boolean;
};

// types for Event Model
export type EventType = {
    _id: string;
    eventTitle: string;
    description: string;
    hostUser: UserType;
    location: string;
    startTime: Date;
    durationMinutes: number;
    transportInfo: string;
    registeredUsers: UserType[];
    maxCapacity: number;
};
