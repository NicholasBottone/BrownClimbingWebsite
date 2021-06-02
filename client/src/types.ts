// types for User Model
export type UserType = {
    googleId: string;
    displayName: string;
    email?: string;
    displayPictureURL?: string;
    memberSince?: Date; // TODO Implement member since
    lastLogin?: Date; // TODO Implement last login
};

// types for Location Model
export type LocationType = {
    name: string;
    streetAddress: string;
    city: string;
    state: string;
    // TODO Change to Google Maps link
};

// types for Event Model
export type EventType = {
    eventTitle: string;
    description: string;
    hostUser: UserType;
    location: LocationType;
    startTime: Date;
    durationMinutes: number;
    transportType: string;
    registeredUsers: UserType[];
    maxCapacity: number;
};
