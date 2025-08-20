import React, { useState } from 'react'
import axios from 'axios'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export default function App(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [role,setRole]=useState('OWNER'); const [msg,setMsg]=useState('')
  async function register(e){ e.preventDefault(); setMsg('')
    try{ const {data}=await axios.post(`${API}/auth/register`,{name,email,password,role}); setMsg(`Usuário criado: ${data.name} (${data.email})`); setName(''); setEmail(''); setPassword('') }
    catch(err){ setMsg(err?.response?.data?.message || 'Erro ao cadastrar') } }
  return (<div style={{maxWidth:420, margin:'4rem auto', fontFamily:'sans-serif'}}>
    <h1>Cadastro PetCare</h1>
    <form onSubmit={register}>
      <label>Nome</label><input value={name} onChange={e=>setName(e.target.value)} required style={{width:'100%',padding:8,margin:'6px 0 12px'}}/>
      <label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:8,margin:'6px 0 12px'}}/>
      <label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:8,margin:'6px 0 12px'}}/>
      <label>Perfil</label><select value={role} onChange={e=>setRole(e.target.value)} style={{width:'100%',padding:8,margin:'6px 0 12px'}}>
        <option value="OWNER">Dono</option><option value="SITTER">Sitter</option></select>
      <button type="submit" style={{width:'100%',padding:10}}>Criar conta</button>
    </form>
    {msg && <p style={{marginTop:16}}>{msg}</p>}
    <p style={{opacity:.7, marginTop:32}}>API: {API}</p>
  </div>)}
