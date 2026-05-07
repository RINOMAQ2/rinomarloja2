import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

const users = { admin: { senha:'123456', tipo:'admin', nome:'Administrador' }, breno:{ senha:'919293', tipo:'motorista', nome:'Breno' }, kleifor:{ senha:'919293', tipo:'motorista', nome:'Kleifor' } };
const initial = [
  { id:1, cliente:'Obra Lumier', endereco:'Florianópolis/SC', equipamento:'Escoras metálicas', motorista:'breno', status:'Pendente', data:'Hoje', obs:'Entregar e coletar assinatura' },
  { id:2, cliente:'JF Construtora', endereco:'Norte da Ilha', equipamento:'Betoneira', motorista:'kleifor', status:'Em rota', data:'Hoje', obs:'Confirmar retirada no local' }
];
function App(){
  const [login,setLogin]=useState({user:'',senha:''}); const [user,setUser]=useState(null);
  const [entregas,setEntregas]=useState(()=>JSON.parse(localStorage.getItem('entregasRinomaq')||'null')||initial);
  const [form,setForm]=useState({cliente:'',endereco:'',equipamento:'',motorista:'breno',data:'Hoje',obs:''});
  const salvar=(lista)=>{setEntregas(lista);localStorage.setItem('entregasRinomaq',JSON.stringify(lista));}
  const entrar=()=>{const u=users[login.user.toLowerCase()]; if(u&&u.senha===login.senha) setUser({login:login.user.toLowerCase(),...u}); else alert('Login ou senha incorretos');}
  const minhas=useMemo(()=> user?.tipo==='admin'?entregas:entregas.filter(e=>e.motorista===user?.login),[entregas,user]);
  const add=()=>{ if(!form.cliente||!form.endereco) return alert('Preencha cliente e endereço'); salvar([{id:Date.now(),status:'Pendente',...form},...entregas]); setForm({cliente:'',endereco:'',equipamento:'',motorista:'breno',data:'Hoje',obs:''});}
  const status=(id,s)=>salvar(entregas.map(e=>e.id===id?{...e,status:s}:e));
  if(!user) return <div className="login"><div className="card"><h1>Rinomaq Entregas</h1><p>Sistema de entregas e retiradas</p><input placeholder="Usuário" value={login.user} onChange={e=>setLogin({...login,user:e.target.value})}/><input placeholder="Senha" type="password" value={login.senha} onChange={e=>setLogin({...login,senha:e.target.value})}/><button onClick={entrar}>Entrar</button><small>Admin: admin/123456 • Breno/Kleifor: 919293</small></div></div>;
  return <div><header><h1>Rinomaq Entregas</h1><span>{user.nome}</span><button onClick={()=>setUser(null)}>Sair</button></header><main>{user.tipo==='admin'&&<section className="card"><h2>Nova entrega</h2><div className="grid"><input placeholder="Cliente/Obra" value={form.cliente} onChange={e=>setForm({...form,cliente:e.target.value})}/><input placeholder="Endereço" value={form.endereco} onChange={e=>setForm({...form,endereco:e.target.value})}/><input placeholder="Equipamento" value={form.equipamento} onChange={e=>setForm({...form,equipamento:e.target.value})}/><select value={form.motorista} onChange={e=>setForm({...form,motorista:e.target.value})}><option value="breno">Breno</option><option value="kleifor">Kleifor</option></select><input placeholder="Data" value={form.data} onChange={e=>setForm({...form,data:e.target.value})}/><input placeholder="Observações" value={form.obs} onChange={e=>setForm({...form,obs:e.target.value})}/></div><button onClick={add}>Cadastrar entrega</button></section>}<section className="cards">{minhas.map(e=><article className="entrega" key={e.id}><b>{e.cliente}</b><p>{e.endereco}</p><p><strong>Equipamento:</strong> {e.equipamento||'-'}</p><p><strong>Motorista:</strong> {users[e.motorista]?.nome}</p><p><strong>Data:</strong> {e.data}</p><p>{e.obs}</p><span className={'badge '+e.status.replace(' ','')}>{e.status}</span><div className="acoes"><button onClick={()=>status(e.id,'Em rota')}>Em rota</button><button onClick={()=>status(e.id,'Entregue')}>Entregue</button><button onClick={()=>status(e.id,'Retirado')}>Retirado</button></div></article>)}</section></main></div>
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
