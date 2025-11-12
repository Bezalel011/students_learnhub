import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Signup(){
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', r.data.token);
      nav('/dashboard');
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert('Signup failed');
    }
  };
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="border p-2 rounded w-full" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border p-2 rounded w-full" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 rounded bg-black text-white">Sign up</button>
      </form>
    </div>
  );
}
