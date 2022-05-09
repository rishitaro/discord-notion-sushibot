# Discord <> Notion Sushibot
A simple discord bot that adds slash commands to create Notion pages in a given Discord server.

## Getting started 
Ensure you 
Install dependencies with `npm i`


### Start bot locally  
``` sh
npm test # this starts the bot with development env secrets 
npm start # this starts bot with production env secrets 
```

### Deploy slash commands to discord server 
Whenever slash commands (found in the `commands/` directory) are created, updated, or deleted, the server will need to be updated. 
``` sh
npm run deploy
```

## Secrets Management
Secrets management is done with [dotenv-vault](https://www.dotenv.org/get-started). To get started in this repo, ensure you have `dotenv-vault` installed.

### Pull .env files
The following command will auto populate `.env<.NODE_ENV>` files into your cloned repo. The `.env` file  
```
npx dotenv-vault pull <environment>
```

### Push .env files
The following command will update secrets in the source. Proceed with caution 
```
npx dotenv-vault push <environment>
```

## Deployment 
tbd once I figure out where I wanna host this thing