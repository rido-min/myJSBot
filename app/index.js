"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const botbuilder_1 = require("botbuilder");
const bot_1 = require("./bot");
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
});
const credentialsFactory = new botbuilder_1.ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
});
const botFrameworkAuthentication = (0, botbuilder_1.createBotFrameworkAuthenticationFromConfiguration)(null, credentialsFactory);
const adapter = new botbuilder_1.CloudAdapter(botFrameworkAuthentication);
// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    await context.sendTraceActivity('OnTurnError Trace', `${error}`, 'https://www.botframework.com/schemas/error', 'TurnError');
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};
adapter.onTurnError = onTurnErrorHandler;
const myBot = new bot_1.EchoBot();
server.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, context => myBot.run(context));
});
//# sourceMappingURL=index.js.map