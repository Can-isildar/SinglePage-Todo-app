
const Notes = require('../models/note')

const { UnauthorizedError, NotFoundError } = require('../utils/custom-erors')


async function addNote({ jsonData }) {

    const notes = await Notes.query().insert(jsonData);
    return notes;
}

async function addContent({ id, jsonData }) {
    const notes = await Notes.query().findById(id).patch({content:jsonData})
    return notes;
}

async function getNote({ id, userId, throwNotFound = true }) {

    const note = await Notes.query().where('id', id).first()

    note.checkAuth(userId);

    if (note) {

        return note;
    }
    else {
        if (throwNotFound) {
            throw NotFoundError();
        }
        return null;
    }

}

async function deleteNote({ id, userId }) {
    let result = await getNote({ id, userId }); // getTodoItem sonucunu bekleyin
    return result = await Notes.query().delete().where('notes.id', id).skipUndefined();

}


async function updateNote({ id, userId, jsonData }) {
    let result = await getNote({ id, userId }); // getTodoItem sonucunu bekleyin

    return result = await Notes.query().patch(jsonData).where('notes.id', id).skipUndefined();


}
async function getAllNote(userId) {

    return await Notes.query().where('user_id', userId).select('*')//withGraphFetched('notes');


}





module.exports = {
    addNote,
    getNote,
    deleteNote,
    updateNote,
    getAllNote,
    addContent,

}