//import { ActivityHandler, BotHandler, MessageFactory, TurnContext } from 'botbuilder';

import {ActivityHandler, TurnContext, MessageFactory} from './botfx/botBase.js'

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context : TurnContext, next : () => Promise<void>) => {
            const replyText = `Echo: ${ context.activity.text }`;
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            await next();
        });

        this.onMembersAdded(async (context: TurnContext, next: () => Promise<void>) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome from myJSBot!';
            if (membersAdded) {
                for (const member of membersAdded) {
                    if (member.id !== context.activity.recipient.id) {
                        await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                    }
                }
            }
            await next();
        });
    }
}
