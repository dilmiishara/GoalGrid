import React, { useEffect, useState, useTransition } from 'react';
import { Label } from "./ui/label";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../actions/userActions';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [state, setState] = useState({ success: null, error: null });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        navigate("/todos"); // Redirect to the Todo page after login
      }, 2000);
    }
  }, [state.success, navigate]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await login(formData); // Call login function
        setState(result); // Update state based on result
      } catch (error) {
        setState({ success: null, error: "Login failed. Please try again." }); // Handle error properly
        console.error("Login error: ", error); // Log error for debugging
      }
    });
  };

  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form onSubmit={handleSubmit} className='flex flex-col gap-6 max-w-xl w-full px-8'>
        <div className='flex flex-col gap-2'>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {state.error && <span className='text-red-500'>{state.error}</span>} {/* Display error message */}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
        <span className='text-[#63657b] text-center'>
          Don't have an account? {" "}
          <Link to="/register" className="transition ease-in-out hover:cursor-pointer hover:text-primary hover:underline">
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
