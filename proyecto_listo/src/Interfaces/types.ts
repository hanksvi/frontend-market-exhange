export interface AuthResponseError{
    body: {
        error: string;
    }
}

export interface User{
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    isAdmin: boolean;
}