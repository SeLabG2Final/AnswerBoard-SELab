import { db } from './firebase-config';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    query,
    where
} from 'firebase/firestore';

function getColRef(colName) {
    return collection(db, colName);
}

function getDocRefById(id, colName) {
    return doc(db, colName, id);
}

function queryDocsWhere(colRef, attr1, condition, attr2) {
    return query(colRef, where(attr1, condition, attr2));
}

async function getAllDocsFrom(colRef) {
    try {
        const snapshot = await getDocs(colRef);
        let allDocs = [];
        snapshot.docs.forEach((doc) => {
            allDocs.push({ ...doc.data(), id: doc.id });
        });
        return allDocs;
    }
    catch (error) {
        console.log(error.message);
    }
}

export {
    getColRef,
    getDocRefById,
    getDoc,
    queryDocsWhere,
    getAllDocsFrom,
    setDoc,
    addDoc
};