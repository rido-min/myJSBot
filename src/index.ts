import express from 'express';
import {
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication
} from  './botfx/botBase.js';

import { EchoBot } from './bot.js';

const server = express()
server.use(express.json());

const port = process.env.port || process.env.PORT || 3978

server.listen(port, () => {
    console.log(`\n${server.name} on ${port}`);
});

// const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
//     MicrosoftAppId: process.env.MicrosoftAppId,
//     MicrosoftAppPassword: process.env.MicrosoftAppPassword,
//     MicrosoftAppType: process.env.MicrosoftAppType,
//     MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
// });

// const botFrameworkAuthentication = ConfigurationBotFrameworkAuthentication

const adapter = new CloudAdapter( new ConfigurationBotFrameworkAuthentication() );

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${ error }`);
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

adapter.onTurnError = onTurnErrorHandler;
const myBot = new EchoBot();
server.post('/api/messages', async (req : express.Request, res: express.Response) => {
    console.log(typeof req.body);
    await adapter.process(req, res, context => myBot.run(context));
});
