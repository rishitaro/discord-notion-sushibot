require('dotenv/config')
const { Client } =  require('@notionhq/client');

const notionClient = new Client({ auth: process.env.NOTION_SECRET_TOKEN});

const ROSTER_DB_ID = '34cc23d763644f9aadef5c19d5cf6a27';

const getUser = async (tag) => {
    let pageId;
    try {
        const response = await notionClient.databases.query({
            database_id: ROSTER_DB_ID,
            filter: {
                'property': 'Discord Tag',
                'text': {
                    'containts': tag,
                }
            },
        });

        pageId = response.results[0].id;
    } catch (error) {
        console.error(error.body);
        throw error;
    }

    const userInfo = await notionClient.pages.retrieve({ page_id: pageId });
    return userInfo.properties['Notion User']['people'][0];
}

const createMeetingNotesPage = async (tags) => {
    console.log('in create meeting notes page method');
}

module.exports = { getUser };