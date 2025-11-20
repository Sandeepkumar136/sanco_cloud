// src/appwrite.js
import { Client, Account, Databases, ID, Permission, Role } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = process.env.REACT_APP_APPWRITE_DB_ID;
export const NOTES_COLLECTION_ID = process.env.REACT_APP_APPWRITE_NOTES_ID;
export const TASKS_COLLECTION_ID = process.env.REACT_APP_APPWRITE_TASKS_ID;
export const EVENTS_COLLECTION_ID = process.env.REACT_APP_APPWRITE_EVENTS_ID;

export { ID, Permission, Role };
