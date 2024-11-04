
import { Activity, ConversationReference, ActivityTypes, ResourceResponse } from "./activity.js";

export type BotHandler = (context: TurnContext, next: () => Promise<void>) => Promise<void>;

export class ConfigurationBotFrameworkAuthentication {}


export class TurnContext
{
    activity: Activity;
    adapter: CloudAdapter;
    
    constructor(adapter: CloudAdapter, activity: Activity) {
        this.adapter = adapter;
        this.activity = activity;
    }

    static getConversationReference(activity: Partial<Activity>): Partial<ConversationReference> {
        return {
            activityId: activity.source.id, //getAppropriateReplyToId(activity)
            user: activity.from, // shallowCopy(activity.from),
            bot: activity.recipient, // shallowCopy(activity.recipient),
            conversation:activity.conversation, // shallowCopy(activity.conversation),
            channelId: activity.channelId,
            locale: activity.locale,
            serviceUrl: activity.serviceUrl,
        };
    }
    static applyConversationReference(activity: Partial<Activity>,reference: Partial<ConversationReference>,isIncoming = false): Partial<Activity> {
        activity.channelId = reference.channelId;
        activity.locale ??= reference.locale;
        activity.serviceUrl = reference.serviceUrl;
        activity.conversation = reference.conversation;
        if (isIncoming) {
            activity.from = reference.user;
            activity.recipient = reference.bot;
            if (reference.activityId) {
                activity.id = reference.activityId;
            }
        } else {
            activity.from = reference.bot;
            activity.recipient = reference.user;
            if (reference.activityId) {
                activity.replyToId = reference.activityId;
            }
        }

        return activity;
    }

    async sendActicvities(activities: Activity[]): Promise<void> {
        const ref = TurnContext.getConversationReference(this.activity);
        activities.map(a => {
            const result = TurnContext.applyConversationReference(a, ref);
            return result;
        })
        
    }

    public async sendActivity(activity: Partial<Activity>): Promise<void> {
        await fetch(this.activity.serviceUrl, {
            method: 'POST',
            body: JSON.stringify(activity),
            headers: { 'Content-Type': 'application/json' } 
        })
    }
}

export class CloudAdapter {
    constructor(authentication: ConfigurationBotFrameworkAuthentication) {}

    createTurnContext(activity: Activity, logic: BotHandler): TurnContext {
        const ctx : TurnContext = new TurnContext(this, activity);
        return ctx;
    }

    async replyToActivity(activity: Partial<Activity>): Promise<number> {
        const path = `${activity.serviceUrl}/v3/conversations/${activity.conversation.id}/activities/${activity.id}`;
        const resp = await fetch(path, {method: 'POST', body: JSON.stringify(activity)});
        return resp.status;
    }


    async sendActivities(context: TurnContext, activities: Partial<Activity>[]): Promise<ResourceResponse[]> {
        const responses: ResourceResponse[] = [];
        for (const activity of activities) {
            delete activity.id;
            let response: ResourceResponse;
            const resp = await this.replyToActivity(activity)
            response = { id: resp.toString() };
            responses.push(response);
        }
        return responses;
    }

    public  onTurnError = async (context: TurnContext, error: Error) => {
    }

    public async process(req, res, logic: (context: TurnContext) => Promise<void>) : Promise<void> {
        const activity: Activity = req.body;
        const ctx = this.createTurnContext(activity, logic);
        await logic(ctx);
    }
}



export class MessageFactory
{
    static text(replyText: string, replyText2: string): Partial<Activity> {
        const activity: Activity = new Activity();
        activity.text = replyText;
        return activity;
    }
}

export class ActivityHandler
{
    protected readonly handlers: { [type: string]: BotHandler[] } = {};

    protected defaultNextEvent(context: TurnContext): () => Promise<void> {
        const run = async() : Promise<void> => {}
        return run;
    }

    protected async handle(context: TurnContext, type: string, onNext: () => Promise<void>): Promise<any> {
        let returnValue: any = null;

        async function runHandler(index: number): Promise<void> {
            if (index < handlers.length) {
                const val = await handlers[index](context, () => runHandler(index + 1));
                // if a value is returned, and we have not yet set the return value,
                // capture it.  This is used to allow InvokeResponses to be returned.
                if (typeof val !== 'undefined' && returnValue === null) {
                    returnValue = val;
                }
            } else {
                const val = await onNext();
                if (typeof val !== 'undefined') {
                    returnValue = val;
                }
            }
        }

        const handlers = this.handlers[type] || [];
        await runHandler(0);

        return returnValue;
    }

    protected on(type: string, handler: BotHandler) {
        if (!this.handlers[type]) {
            this.handlers[type] = [handler];
        } else {
            this.handlers[type].push(handler);
        }
        return this;
    }

    onTurn(handler: BotHandler): this {
        return this.on('Turn', handler);
    }

    onMessage(handler: BotHandler): this {
        return this.on('Message', handler);
    }

    async onTurnActivity(context: TurnContext): Promise<void> {
        switch (context.activity.type) {
            case ActivityTypes.Message:
                await this.onMessageActivity(context);
                break;
            default:
                await this.onUnrecognizedActivity(context);
                break;
        }
    }

    onMembersAdded(handler: BotHandler): this {
        return this.on('MembersAdded', handler);
    }

    async onMessageActivity(context: TurnContext): Promise<void> {
        await this.handle(context, 'Message', this.defaultNextEvent(context));
    }

    public onUnrecognizedActivity(context: TurnContext): Promise<void> {
        return Promise.resolve();
    }

    async run(context: TurnContext): Promise<void> {
        await this.onTurnActivity(context);
    }

}