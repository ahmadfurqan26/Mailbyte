"use client";

import { useEffect, useState } from "react";

type Stats = { total:number; sent:number; queued:number; failed:number };

export default function Home() {
  const [stats,setStats] = useState<Stats>({total:0,sent:0,queued:0,failed:0});
  const [accounts,setAccounts] = useState<any[]>([]);
  const [templates,setTemplates] = useState<any[]>([]);
  const [form,setForm] = useState({
    name:"Primary SMTP", host:"", port:"587", username:"", password:"",
    secure:false, fromName:"", fromEmail:""
  });
  const [mail,setMail] = useState({
    smtpId:"", to:"", subject:"", text:"", html:""
  });
  const [message,setMessage] = useState("");

  async function load() {
    const r = await fetch("/api/dashboard");
    const d = await r.json();
    setStats(d.stats); setAccounts(d.accounts); setTemplates(d.templates);
    if (!mail.smtpId && d.accounts[0]) setMail(m => ({...m, smtpId:d.accounts[0].id}));
  }
  useEffect(()=>{ load(); },[]);

  async function addAccount(e:React.FormEvent) {
    e.preventDefault(); setMessage("");
    const r = await fetch("/api/smtp", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({...form,port:Number(form.port)})
    });
    const d = await r.json();
    setMessage(d.error || "SMTP account saved.");
    if (r.ok) load();
  }

  async function sendMail(e:React.FormEvent) {
    e.preventDefault(); setMessage("");
    const r = await fetch("/api/send", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify(mail)
    });
    const d = await r.json();
    setMessage(d.error || `Email ${d.status?.toLowerCase() || "processed"}.`);
    if (r.ok) load();
  }

  return (
    <main className="shell">
      <div className="top">
        <div><div className="brand">Built-in SMTP</div><div className="muted">Transactional email control center</div></div>
        <span className="badge">SMTP Engine Ready</span>
      </div>

      <div className="grid">
        <div className="card"><div className="muted">Total</div><div className="stat">{stats.total}</div></div>
        <div className="card"><div className="muted">Sent</div><div className="stat">{stats.sent}</div></div>
        <div className="card"><div className="muted">Queued</div><div className="stat">{stats.queued}</div></div>
        <div className="card"><div className="muted">Failed</div><div className="stat">{stats.failed}</div></div>
      </div>

      {message && <div className="card" style={{marginBottom:18}}>{message}</div>}

      <div className="two">
        <section className="card">
          <h2>SMTP Account</h2>
          <p className="muted">Credentials are encrypted before database storage.</p>
          <form onSubmit={addAccount}>
            <div className="field"><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <div className="two">
              <div className="field"><label>Host</label><input required placeholder="smtp.example.com" value={form.host} onChange={e=>setForm({...form,host:e.target.value})}/></div>
              <div className="field"><label>Port</label><input required type="number" value={form.port} onChange={e=>setForm({...form,port:e.target.value})}/></div>
            </div>
            <div className="two">
              <div className="field"><label>Username</label><input required value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></div>
              <div className="field"><label>Password / App Password</label><input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
            </div>
            <div className="field"><label>From email</label><input required type="email" value={form.fromEmail} onChange={e=>setForm({...form,fromEmail:e.target.value})}/></div>
            <div className="field"><label>From name</label><input value={form.fromName} onChange={e=>setForm({...form,fromName:e.target.value})}/></div>
            <label className="row muted"><input type="checkbox" checked={form.secure} onChange={e=>setForm({...form,secure:e.target.checked})}/> Use implicit TLS/SSL</label>
            <br/><button className="btn">Save SMTP</button>
          </form>
        </section>

        <section className="card">
          <h2>Send Email</h2>
          <p className="muted">Use only for recipients and domains you are authorized to contact.</p>
          <form onSubmit={sendMail}>
            <div className="field"><label>SMTP account</label><select value={mail.smtpId} onChange={e=>setMail({...mail,smtpId:e.target.value})}>{accounts.map(a=><option key={a.id} value={a.id}>{a.name} — {a.host}</option>)}</select></div>
            <div className="field"><label>To</label><input required type="email" value={mail.to} onChange={e=>setMail({...mail,to:e.target.value})}/></div>
            <div className="field"><label>Subject</label><input required value={mail.subject} onChange={e=>setMail({...mail,subject:e.target.value})}/></div>
            <div className="field"><label>Plain text</label><textarea value={mail.text} onChange={e=>setMail({...mail,text:e.target.value})}/></div>
            <div className="field"><label>HTML (optional)</label><textarea value={mail.html} onChange={e=>setMail({...mail,html:e.target.value})}/></div>
            <button className="btn" disabled={!accounts.length}>Send</button>
          </form>
        </section>
      </div>

      <section className="card" style={{marginTop:18}}>
        <h2>Configured SMTP Accounts</h2>
        <table className="table">
          <thead><tr><th>Name</th><th>Host</th><th>From</th><th>Port</th></tr></thead>
          <tbody>{accounts.map(a=><tr key={a.id}><td>{a.name}</td><td>{a.host}</td><td>{a.fromEmail}</td><td>{a.port}</td></tr>)}</tbody>
        </table>
      </section>

      <section className="card" style={{marginTop:18}}>
        <h2>Templates</h2>
        <div className="notice">The data model already supports reusable HTML/text templates and dynamic variables. Add a template editor and variable renderer as the next UI layer.</div>
        {templates.length > 0 && <table className="table"><tbody>{templates.map(t=><tr key={t.id}><td>{t.name}</td><td>{t.subject}</td></tr>)}</tbody></table>}
      </section>
    </main>
  );
}
