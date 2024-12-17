import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DeleteIcon from './icons/DeleteIcon';
import EditIcon from './icons/EditIcon';
import TickIcon from './icons/TickIcon';
import { CircleUserRound } from 'lucide-react';
import { Input } from './ui/input'; // Make sure Input is correctly imported
import { Plus } from 'lucide-react'; // Ensure Plus icon is imported
import useSWR from 'swr';

const fetcher = (url, options = {}) =>
  fetch(url, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    mode: 'cors',
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());

const Todos = () => {
  const { data, error, mutate, isLoading } = useSWR(
    'http://localhost:3000/api/todos',
    fetcher
  );
  const [newTodo, setNewTodo] = useState('');

  if (error) {
    return <h1 className="text-2xl py-2 text-center">Something went wrong!</h1>;
  }
  if (isLoading) {
    return <h1 className="text-2xl py-2 text-center">Loading...</h1>;
  }

  async function handleAddTodo(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");

    if(!title.trim().length){
      toast.error("Todo can't be empty!");
      return;
    }
    const newTodo ={
      title:`${title} adding...`,
      _id: Date.now().toString(),
      isCompleted:false,
    };
    async function addTodo(params){
      
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error('Please enter a valid todo');
      return;
    }

    // Add new todo here
    fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewTodo(''); // Reset the input field
        mutate(); // Refresh the todo list
        toast.success('Todo added successfully!');
      })
      .catch(() => toast.error('Failed to add todo'));
  };

  return (
    <div className="mx-auto mt-28 max-w-lg px-4 w-full flex flex-col gap-6">
      <div>
        <CircleUserRound />
      </div>
      <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-4xl text-center mb4 text-transparent bg-clip-text">
        Todo App
      </h1>
      <form onSubmit={handleAddTodo} className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Enter todo"
          name="title"
          id="title"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
          className="shadow-md"
        />
        <button
          type="submit"
          className="h-9 rounded-md border border-input bg-transparent px-4 text-base 
          shadow-md flex items-center hover:bg-primary transition ease-linear group"
        >
          <Plus
            size={20}
            className="transition ease-linear group-hover:stroke-white"
          />
        </button>
      </form>
    </div>
  );
};

export default Todos;
