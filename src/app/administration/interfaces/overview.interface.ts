export interface Overview {
    user: OverviewUser;
    pages: OverviewPages[];
}

export interface OverviewUser {
    name: string;
    surname: string;
    role: string;
    email: string;
    picturepath: string;
}

export interface OverviewPages {
    title: string;
    icon?: string;
    permalink: string;
}