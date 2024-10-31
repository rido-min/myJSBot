export interface ResourceResponse {
    id: string;
}

export enum ActivityTypes {
    Message = 'message',
}

export class Activity
{
    id: string;
    replyToId: string;
    source : ChannelAccount;
    channelId: string;
    conversation: ConversationAccount;
    from: ChannelAccount;
    text: string;
    locale: string;
    type: ActivityTypes;
    membersAdded: any;
    recipient: any;
    serviceUrl: string;
}


export interface ConversationAccount {
    isGroup: boolean;
    conversationType: string;
    tenantId?: string;
    id: string;
    name: string;
    aadObjectId?: string;
    role?: RoleTypes;
    properties?: any; 
}

export interface ConversationReference {
    activityId?: string;
    user?: ChannelAccount;
    locale?: string;
    bot: ChannelAccount;
    conversation: ConversationAccount;
    channelId: string;
    serviceUrl: string;
}

export interface ChannelAccount {
    id: string;
    name: string;
    aadObjectId?: string;
    role?: RoleTypes | string;
    properties?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export enum RoleTypes {
    User = 'user',
    Bot = 'bot',
    Skill = 'skill',
}