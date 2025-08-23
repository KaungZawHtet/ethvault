const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const { v4: uuidv4 } = require('uuid');

// In-memory storage for notes
let notes = [];
let nextId = 1;

// Helper function to find note by ID
const findNoteById = (id) => {
  return notes.find(note => note.id === id);
};

// Create a new note
exports.createNote = asyncErrorHandler(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return next(new ErrorHandler("Please provide both title and content", 400));
  }

  const newNote = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  notes.push(newNote);

  res.status(201).json({
    success: true,
    message: "Note created successfully",
    note: newNote
  });
});

// Get all notes
exports.getAllNotes = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    count: notes.length,
    notes: notes
  });
});

// Get a specific note by ID
exports.getNoteById = asyncErrorHandler(async (req, res, next) => {
  const noteId = parseInt(req.params.id);
  
  if (isNaN(noteId)) {
    return next(new ErrorHandler("Invalid note ID", 400));
  }

  const note = findNoteById(noteId);

  if (!note) {
    return next(new ErrorHandler("Note not found", 404));
  }

  res.status(200).json({
    success: true,
    note: note
  });
});

// Update a note
exports.updateNote = asyncErrorHandler(async (req, res, next) => {
  const noteId = parseInt(req.params.id);
  
  if (isNaN(noteId)) {
    return next(new ErrorHandler("Invalid note ID", 400));
  }

  const { title, content } = req.body;

  if (!title && !content) {
    return next(new ErrorHandler("Please provide title or content to update", 400));
  }

  const noteIndex = notes.findIndex(note => note.id === noteId);

  if (noteIndex === -1) {
    return next(new ErrorHandler("Note not found", 404));
  }

  // Update the note
  if (title) notes[noteIndex].title = title.trim();
  if (content) notes[noteIndex].content = content.trim();
  notes[noteIndex].updatedAt = new Date();

  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    note: notes[noteIndex]
  });
});

// Delete a note
exports.deleteNote = asyncErrorHandler(async (req, res, next) => {
  const noteId = parseInt(req.params.id);
  
  if (isNaN(noteId)) {
    return next(new ErrorHandler("Invalid note ID", 400));
  }

  const noteIndex = notes.findIndex(note => note.id === noteId);

  if (noteIndex === -1) {
    return next(new ErrorHandler("Note not found", 404));
  }

  const deletedNote = notes.splice(noteIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
    deletedNote: deletedNote
  });
});

// Bonus: Clear all notes (for testing purposes)
exports.clearAllNotes = asyncErrorHandler(async (req, res, next) => {
  const deletedCount = notes.length;
  notes = [];
  nextId = 1;

  res.status(200).json({
    success: true,
    message: `Cleared ${deletedCount} notes`,
    deletedCount: deletedCount
  });
});
