'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:4001/api/notes'; // for quick purpose. In real world, we use env variables for security and ease purpose at diff environment

  // Fetch all notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      if (data.success) {
        setNotes(data.notes);
        setMessage(`Loaded ${data.count} notes`);
      }
    } catch (error) {
      setMessage('Error fetching notes: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new note
  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setMessage('Please fill in both title and content');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Note created successfully!');
        setNewNote({ title: '', content: '' });
        fetchNotes(); // Refresh the list
      } else {
        setMessage('Error creating note');
      }
    } catch (error) {
      setMessage('Error creating note: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // Update a note
  const updateNote = async (id: number, updatedNote: Partial<Note>) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Note updated successfully!');
        setEditingNote(null);
        fetchNotes(); // Refresh the list
      } else {
        setMessage('Error updating note');
      }
    } catch (error) {
      setMessage('Error updating note: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a note
  const deleteNote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Note deleted successfully!');
        fetchNotes(); // Refresh the list
      } else {
        setMessage('Error deleting note');
      }
    } catch (error) {
      setMessage('Error deleting note: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Notes API Demo</h1>
      
      {/* Status Message */}
      {message && (
        <div className="mb-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
          {message}
        </div>
      )}

      {/* Create New Note Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
        <form onSubmit={createNote}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter note title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Content:
            </label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              placeholder="Enter note content"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Note'}
          </button>
        </form>
      </div>

      {/* Notes List */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Notes ({notes.length})</h2>

        </div>

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notes found. Create your first note above!</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded p-4">
                {editingNote?.id === note.id ? (
                  // Edit Mode
                  <div>
                    <input
                      type="text"
                      value={editingNote.title}
                      onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                      className="w-full mb-2 p-2 border rounded"
                    />
                    <textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                      className="w-full mb-2 p-2 border rounded"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateNote(note.id, { title: editingNote.title, content: editingNote.content })}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNote(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                    <p className="text-gray-700 mb-3">{note.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div>
                        <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
                        <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingNote(note)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
