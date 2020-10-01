import React from 'react'
import { openDB } from 'idb';

const db = async function indexedDB() {
    
    db = await openDB('storage', 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            const store = db.createObjectStore('savedJobs');
            console.log('upgrade db needed');
            //store.createIndex('date', 'date')
        
        } 
    })
       
    return db
}

export default db