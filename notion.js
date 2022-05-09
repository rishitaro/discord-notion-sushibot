const { Client } =  require('@notionhq/client');

const notionClient = new Client({ auth: process.env.NOTION_SECRET_TOKEN});

const ROSTER_DB_ID = process.env.NOTION_ROSTER_DB_ID;
const MEETING_NOTES_DB_ID = process.env.NOTION_MEETING_NOTES_DB_ID;

const getUser = async (tag) => {
    let pageId;
    try {
        const response = await notionClient.databases.query({
            database_id: ROSTER_DB_ID,
            filter: {
                'property': 'Discord Tag',
                'rich_text': {
                    'contains': tag,
                }
            },
        });

        pageId = response.results[0].id;
    } catch (error) {
        console.error(error.body);
        return pageId;
    }

    const userInfo = await notionClient.pages.retrieve({ page_id: pageId });
    return userInfo.properties['Notion User']['people'][0];
}

const getTestDatabase = async () => {
    try{
        const response = await notionClient.databases.retrieve({
            database_id: MEETING_NOTES_DB_ID,
        }); 
        return response; 
    } catch(exception) {
        console.error(exception.body);
    }
}

const createMeetingNotesPage = async (pageTitle, tags, requester) => {
    console.log('in create meeting notes page method');

    try {
        const response = await notionClient.pages.create({
            parent: {
                database_id: MEETING_NOTES_DB_ID,
            },
            icon: createIcon(), 
            properties: createProperties(pageTitle, tags, requester),
        });

        return response;
    } catch (exception) {
        console.error(exception.body);
    }
}

const createIcon = () => {
    return {
        type: 'external',
        external: {
            url: 'https://i.ibb.co/LxQX3w4/Mask-Group.png'
        }
    };
}

const createProperties = (pageTitle, tags, requester) => {
    const pageName = {
        title: [
            {
                text: {
                    content: pageTitle,
                }
            }
        ]
    };
    const typeSelects = { multi_select:[{name: 'discord'}, {name: 'notionbot'}] };

    for (tag of tags) {
        typeSelects.multi_select.push({
            name: tag,
        })
    }

    const attendees = {
        people: [ requester ]
    }

    return {
        Name: pageName,
        Type: typeSelects,
        Attendees: attendees
    }
}

module.exports = { getUser, createMeetingNotesPage, getTestDatabase };