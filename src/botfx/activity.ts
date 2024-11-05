export interface ResourceResponse {
    id: string;
}

export enum ActivityTypes {
    Message = 'message',
    ContactRelationUpdate = 'contactRelationUpdate',
    ConversationUpdate = 'conversationUpdate',
    Typing = 'typing',
    EndOfConversation = 'endOfConversation',
    Event = 'event',
    Invoke = 'invoke',
    InvokeResponse = 'invokeResponse',
    DeleteUserData = 'deleteUserData',
    MessageUpdate = 'messageUpdate',
    MessageDelete = 'messageDelete',
    InstallationUpdate = 'installationUpdate',
    MessageReaction = 'messageReaction',
    Suggestion = 'suggestion',
    Trace = 'trace',
    Handoff = 'handoff',
    Command = 'command',
    CommandResult = 'commandResult',
}

export enum Channels {
    Alexa = 'alexa',
    Console = 'console',
    Directline = 'directline',
    DirectlineSpeech = 'directlinespeech',
    Email = 'email',
    Emulator = 'emulator',
    Facebook = 'facebook',
    Groupme = 'groupme',
    Webchat = 'webchat',
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