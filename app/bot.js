"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EchoBot = void 0;
const botbuilder_1 = require("botbuilder");
class EchoBot extends botbuilder_1.ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${context.activity.text}`;
            await context.sendActivity(botbuilder_1.MessageFactory.text(replyText, replyText));
            await next();
        });
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome from myJSBot!';
            if (membersAdded) {
                for (const member of membersAdded) {
                    if (member.id !== context.activity.recipient.id) {
                        await context.sendActivity(botbuilder_1.MessageFactory.text(welcomeText, welcomeText));
                    }
                }
            }
            await next();
        });
    }
}
exports.EchoBot = EchoBot;
//# sourceMappingURL=bot.js.map