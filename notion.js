import { Client } from "@notionhq/client"
import "dotenv/config"
const notion = new Client({ auth: process.env.NOTION_SECRET_TOKEN})