declare type Notifications = {
    id: string;
    name: string;
    medium: NotificationMedium;
    subject: string,
    owner: string;
    tags: string;
    status: string;
    triggerAt: string | null;
    createdAt: string;
}

declare type NotificationsListResponse = {
    count: number;
    limit: number;
    page: number;
    data: Notifications[];
};

declare type UserNotification = {
    data : {
        id: string;
        name: string;
        medium: NotificationMedium;
        subject: string,
        owner: string;
        tags: string;
        status: string;
        message: string;
        triggerAt: string | null;
        createdAt: string;
    }
}

declare type NotificationMedium = ['email' | 'whatsapp' | 'in-app'];