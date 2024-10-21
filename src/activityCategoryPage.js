import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityCategories = () => {
  const [categories, setCategories] = useState([]); // To hold activity categories from the API
  const [newCategory, setNewCategory] = useState(''); // To hold the input for a new category
  const [editCategory, setEditCategory] = useState({ id: null, category: '' }); // To hold category being edited

  // Fetch the categories from the backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3500/api/activityCategory');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err.message);
    }
  };

  // Handle creating a new activity category
  const handleCreateCategory = async () => {
    try {
      if (!newCategory.trim()) {
        alert('Please enter a valid category name');
        return;
      }
      const res = await axios.post('http://localhost:3500/api/activityCategory', { category: newCategory });
      setCategories([...categories, res.data.data]); // Update the state with the new category
      setNewCategory(''); // Clear input field
    } catch (err) {
      console.error('Error creating category:', err.message);
    }
  };

  // Handle updating an existing category
  const handleUpdateCategory = async (id) => {
    try {
      if (!editCategory.category.trim()) {
        alert('Category name cannot be empty');
        return;
      }
      const res = await axios.put(`http://localhost:3500/api/activityCategory/${id}`, { category: editCategory.category });
      const updatedCategories = categories.map((cat) =>
        cat._id === id ? res.data.data : cat
      );
      setCategories(updatedCategories); // Update the state with the updated category
      setEditCategory({ id: null, category: '' }); // Clear edit state
    } catch (err) {
      console.error('Error updating category:', err.message);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/api/activityCategory/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id)); // Remove the deleted category from state
    } catch (err) {
      console.error('Error deleting category:', err.message);
    }
  };

  return (
    <div>
      <h1>Activity Categories</h1>

      {/* Create new category */}
      <div>
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleCreateCategory}>Create Category</button>
      </div>

      {/* List categories */}
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            {/* If editing, show an input field */}
            {editCategory.id === category._id ? (
              <input
                type="text"
                value={editCategory.category}
                onChange={(e) => setEditCategory({ ...editCategory, category: e.target.value })}
              />
            ) : (
              <span>{category.category}</span>
            )}

            {/* Edit button */}
            {editCategory.id === category._id ? (
              <button onClick={() => handleUpdateCategory(category._id)}>Save</button>
            ) : (
              <button onClick={() => setEditCategory({ id: category._id, category: category.category })}>
                Edit
              </button>
            )}

            {/* Delete button */}
            <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityCategories;
