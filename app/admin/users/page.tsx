'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, Download, UserCheck, UserX } from 'lucide-react';
import { listUsers, updateUser } from '@/lib/admin-api';
import type { UserDoc } from '@/lib/types';
import { PageHeader, useAction } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

const fmt = (v: unknown) => (typeof v === 'number' ? new Date(v).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '—');
const PKG: Record<string, string> = { free: 'Free', basic: 'Beginner', allinone: 'All-in-One', pro: 'Pro', pro_standalone: 'Pro Dev' };

export default function Users() {
  const [items, setItems] = useState<UserDoc[] | null>(null);
  const [q, setQ] = useState('');
  const [f, setF] = useState<'all' | 'admin' | 'legacy' | 'inactive'>('all');
  const { run } = useAction();
  useEffect(() => { listUsers().then((u) => setItems(u.sort((a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0)))); }, []);

  const list = useMemo(() => (items ?? []).filter((u) => {
    if (f === 'admin' && !u.isAdmin) return false;
    if (f === 'legacy' && !(u.package && u.package !== 'free')) return false;
    if (f === 'inactive' && u.isActive !== false) return false;
    const s = q.toLowerCase();
    return !s || u.email?.toLowerCase().includes(s) || u.displayName?.toLowerCase().includes(s);
  }), [items, q, f]);

  const patch = (uid: string, p: Partial<UserDoc>, msg: string) =>
    run(async () => { await updateUser(uid, p); setItems((x) => x?.map((u) => (u.uid === uid ? { ...u, ...p } : u)) ?? x); }, msg);

  const exportCsv = () => {
    const rows = [['email', 'name', 'provider', 'package', 'active', 'admin', 'created'], ...list.map((u) => [u.email, u.displayName, u.provider ?? '', u.package ?? '', String(u.isActive !== false), String(!!u.isAdmin), fmt(u.createdAt)])];
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `members-${Date.now()}.csv`; a.click();
  };

  return (
    <>
      <PageHeader title="สมาชิก" sub={`ฐานข้อมูลลูกค้าทั้งหมด ${items?.length ?? '…'} คน (รวมลูกค้าจากเว็บเดิม)`}
        actions={<button onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm"><Download className="size-4" />ส่งออก CSV</button>} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="flex h-11 w-full max-w-sm items-center gap-2 rounded-xl border border-line-strong bg-surface px-3.5">
          <Search className="size-4 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาอีเมลหรือชื่อ…" className="h-full flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        {([['all', 'ทั้งหมด'], ['legacy', 'ลูกค้าแพ็กเกจเดิม'], ['admin', 'แอดมิน'], ['inactive', 'ถูกระงับ']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setF(k)} className={cn('h-9 rounded-full border px-4 text-sm', f === k ? 'border-fg bg-fg text-bg' : 'border-line-strong text-fg-2')}>{l}</button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-[20px] border border-line bg-surface">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-muted">
            <tr><th className="px-5 py-3 font-normal">สมาชิก</th><th className="px-3 py-3 font-normal">แพ็กเกจเดิม</th><th className="px-3 py-3 font-normal">สมัครเมื่อ</th><th className="px-3 py-3 font-normal">ความคืบหน้า</th><th className="px-5 py-3 text-right font-normal">จัดการ</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items === null && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">กำลังโหลด…</td></tr>}
            {list.map((u) => (
              <tr key={u.uid} className={cn(u.isActive === false && 'opacity-55')}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {u.photoURL
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={u.photoURL} alt="" className="size-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                      : <span className="grid size-9 place-items-center rounded-full bg-surface-2 font-semibold">{(u.displayName || u.email || '?').slice(0, 1)}</span>}
                    <div className="min-w-0"><p className="flex items-center gap-1.5 font-medium">{u.displayName || '—'}{u.isAdmin && <ShieldCheck className="size-3.5 text-orange" />}</p><p className="truncate font-mono text-xs text-muted">{u.email} · {u.provider === 'google' ? 'Google' : 'Email'}</p></div>
                  </div>
                </td>
                <td className="px-3 py-3"><span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-xs">{PKG[u.package ?? ''] ?? u.package ?? '—'}</span></td>
                <td className="px-3 py-3 font-mono text-xs text-muted">{fmt(u.createdAt)}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted">{Object.values(u.progress ?? {}).reduce((s, p) => s + (p.watchedVideos?.length ?? 0), 0)} บท</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => patch(u.uid, { isAdmin: !u.isAdmin }, u.isAdmin ? 'ถอดสิทธิ์แอดมินแล้ว' : 'ตั้งเป็นแอดมินแล้ว')} className="h-8 rounded-lg px-2.5 text-xs text-fg-2 hover:bg-surface-2">{u.isAdmin ? 'ถอดแอดมิน' : 'ตั้งเป็นแอดมิน'}</button>
                    <button onClick={() => patch(u.uid, { isActive: u.isActive === false, needsApproval: false }, u.isActive === false ? 'เปิดใช้งานแล้ว' : 'ระงับบัญชีแล้ว')} className="grid size-8 place-items-center rounded-lg text-fg-2 hover:bg-surface-2" title={u.isActive === false ? 'เปิดใช้งาน' : 'ระงับบัญชี'}>
                      {u.isActive === false ? <UserCheck className="size-4" /> : <UserX className="size-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
