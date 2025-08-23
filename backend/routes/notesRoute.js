const express = require("express");
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  clearAllNotes
} = require("../controllers/notesController");

const router = express.Router();

// POST /api/notes - Create a new note
router.route("/").post(createNote);

// GET /api/notes - Get all notes
router.route("/").get(getAllNotes);

// GET /api/notes/:id - Get a specific note by ID
router.route("/:id").get(getNoteById);

// PUT /api/notes/:id - Update a specific note by ID
router.route("/:id").put(updateNote);

// DELETE /api/notes/:id - Delete a specific note by ID
router.route("/:id").delete(deleteNote);

// DELETE /api/notes/clear/all - Clear all notes (bonus endpoint for testing)
router.route("/clear/all").delete(clearAllNotes);

module.exports = router;
