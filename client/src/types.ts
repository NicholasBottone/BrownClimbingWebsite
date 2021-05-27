// types for User Model
export type UserType = {
    googleId: string;
    displayName: string;
    email?: string;
};

// types for Location Model
export type LocationType = {
    name: string;
    streetAddress: string;
    city: string;
    state: string;
}

// types for Event Model
export type EventType = {
    eventTitle: string;
    hostUser: UserType;
    location: LocationType;
    dateTime: Date
    transportType: string;
    registeredUsers: UserType[];
    maxCapacity: number;
}
