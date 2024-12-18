import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CircleUserRound, DeleteIcon, EditIcon, Plus } from 'lucide-react';
import { Input } from './ui/input';
import useSWR from 'swr';
import TickIcon from './icons/TickIcon';
import EditTodo from './EditTodo';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';

// Fetcher function for API requests
const fetcher = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token'); // Ensure the token is stored here
    if (!token) {
      toast.error('Please log in to continue.');
      throw new Error('No token found. Please log in.');
    }

    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add token in Authorization header
      },
      credentials: 'include',
      ...(options.body && { body: JSON.stringify(options.body) }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Fetcher Error:', err.message);
    throw err;
  }
};

const Todos = () => {
  const navigate = useNavigate();
  const { data, error, mutate, isLoading } = useSWR(
    'http://localhost:3000/api/todos',
    fetcher
  );

  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page if no token
    }
  }, [navigate]);

  const handleError = (error) => {
    toast.error(error);
    throw new Error(error);
  };

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      toast.error("Todo can't be empty!");
      return;
    }

    const optimisticTodo = {
      title: newTodo,
      _id: Date.now().toString(),
      isCompleted: false,
    };

    try {
      // Optimistic update
      mutate(
        async () => {
          const response = await fetcher('http://localhost:3000/api/todos', {
            method: 'POST',
            body: { title: newTodo },
          });

          if (response.error) {
            throw new Error(response.error);
          }

          return [...(data || []), response];
        },
        {
          optimisticData: [...(data || []), optimisticTodo],
          revalidate: true,
          rollbackOnError: true,
        }
      );
    } catch (err) {
      handleError(err.message);
    }

    setNewTodo('');
  };

  async function handleDeleteTodo(id) {
    toast.success('Todo deleted!');
    await mutate(
      async () => {
        const response = await fetcher(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: 'DELETE',
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.filter((todo) => todo._id !== id);
      },
      {
        optimisticData: data.filter((todo) => todo._id !== id),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  async function handleComplete(id, isCompleted) {
    await mutate(
      async () => {
        const response = await fetcher(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: 'PUT',
            body: { isCompleted: !isCompleted },
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, isCompleted: !isCompleted };
          }
          return todo;
        });
      },
      {
        optimisticData: data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, isCompleted: !isCompleted };
          }
          return todo;
        }),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  async function handleUpdate(formData) {
    const title = formData.get('title');
    const id = formData.get('id');
    console.log({ title, id });
    await mutate(
      async () => {
        const response = await fetcher(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: 'PUT',
            body: { title },
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, title };
          }
          return todo;
        });
      },
      {
        optimisticData: data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, title };
          }
          return todo;
        }),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  if (error) {
    return <h1 className="text-2xl py-2 text-center">Something went wrong!</h1>;
  }
  if (isLoading) {
    return <h1 className="text-2xl py-2 text-center">Loading...</h1>;
  }

  const todos = data || [];

  return (
    <div className="mx-auto mt-28 max-w-lg px-4 w-full flex flex-col gap-6">
      <div className="flex justify-end">
        <Profile />
      </div>
      <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-4xl text-center mb-4 text-transparent bg-clip-text">
        Todo App
      </h1>
      <form onSubmit={handleAddTodo} className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Enter todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
          className="shadow-md"
        />
        <button
          type="submit"
          className="h-9 rounded-md border border-input bg-transparent px-4 text-base shadow-md"
        >
          <Plus size={20} />
        </button>
      </form>

      {todos.length ? (
        <div className="shadow-md border-2 border-input bg-transparent flex flex-col rounded">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="flex h-10 items-center w-full border-b-2 last:border-b-0"
            >
              <span
                className={`flex-1 px-3 ${
                  todo.isCompleted ? 'line-through text-[#63657b]' : ''
                }`}
              >
                {todo.title}
              </span>
              <div className="px-3 flex gap-2">
                <TickIcon
                  onClick={() => handleComplete(todo._id, todo.isCompleted)}
                  className={`transition ease-in-out hover:cursor-pointer ${
                    todo.isCompleted ? 'text-primary' : 'text-slate-300'
                  }`}
                />
                <DeleteIcon
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="iconHover"
                />
                <EditTodo
                  HandleUpdate={handleUpdate}
                  id={todo._id}
                  title={todo.title}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span>You don't have any todos</span>
      )}
    </div>
  );
};

export default Todos;
