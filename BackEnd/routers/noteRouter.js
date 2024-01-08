const express = require('express');
const router = express.Router();
const noteService = require('../service/noteService.js');
const authMiddleware = require('../middilewares/authMiddleware.js');
const validate = require('../validator/validator');
const Notes = require('../models/note.js');

router.post('/', authMiddleware.authenticateToken, validate.validateNote, async (req, res) => {
    const jsonData = req.body;
    const userId = authMiddleware.getUserId();
    jsonData.user_id = userId;
    const note = await noteService.addNote({ jsonData });
    res.status(200).json({ note , message: 'veri başarıyla eklendi' });

});

router.patch('/:id', authMiddleware.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const jsonData = req.body.content;
    const note = await noteService.addContent({ id, jsonData });
    res.status(200).json({ note, message: 'veri başarıyla eklendi' });

});


// notes veri cekme by id
router.get('/:id', authMiddleware.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = authMiddleware.getUserId();
    const note = await noteService.getNote({ id, userId, throwNotFound: true });
    res.status(200).json(note)
});


// notes getAll
router.get('/', authMiddleware.authenticateToken, async (req, res) => {
    const userId = authMiddleware.getUserId();
    const note = await noteService.getAllNote(userId);
    res.status(200).json(note);

})

// notes veri silme
router.delete('/:id', authMiddleware.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = authMiddleware.getUserId();
    const note = await noteService.deleteNote({ id, userId });
    res.status(202).json({ id: note.id, message: 'veri başarıyla silindi' });
})

//notes güncelleme
router.put('/:id', authMiddleware.authenticateToken, validate.validateNote, async (req, res) => {
    const jsonData = req.body
    const { id } = req.params;
    const userId = authMiddleware.getUserId();
    const result = await noteService.updateNote({ id, userId, jsonData })
    res.status(200).json({ id: id, message: 'veri başarıyla güncellendi' })
})


module.exports = router;