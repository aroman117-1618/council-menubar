const { ipcMain } = require('electron');
const fetch = require('node-fetch');

ipcMain.handle('council:query', async (_evt, payload, base) => {
  const url = (base || 'http://localhost:8081').replace(/\/+$/, '') + '/query';
  try {
    console.log('[ipc] council:query →', { url, tag: payload?.tag, qLen: (payload?.query||'').length });
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    const json = await res.json();
    console.log('[ipc] council:query ✓', { status: res.status, ok: json?.ok, tokens_in: json?.tokens_in, tokens_out: json?.tokens_out });
    return json;
  } catch (e) {
    console.error('[ipc] council:query ✗', e?.message || e);
    return { ok: false, error: String(e?.message || e) };
  }
});
