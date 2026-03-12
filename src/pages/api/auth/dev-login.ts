import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ redirect }) => {
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6IjMxMzkwYTMxLTkyMWYtNGNjNi1hNDgwLTQ3YjZmY2NmYWE4ZiIsImNsaWVudEVudGl0eUlkIjoiZjNlNzkwNzYtYzI0ZC00YTgyLTgxNDctNGE5MzQ2ODA2ZDRmX2VudGl0eV8xNzU1MTE2OTA5MzA2X3liMDBhOHAxdyIsImNsaWVudE5hbWUiOiJGSU5BTCAtIENEIEJyYXRpc2xhdmEsIHNwb2wuIHMgci4gby4iLCJjb250YWN0TmFtZSI6IkJhcmJvcmEgU2vDoWxvdmEiLCJlbWFpbCI6ImJhcmJvcmEuc2thbG92YUBmaW5hbGNkLnNrIiwib3JnYW5pemF0aW9uSWQiOiJhZXgwcng2bHd3OTE4emRrYm1xeHYwdTEiLCJzdG9yYWdlUGF0aCI6Ii9EQVRBL1rDgUtBWktZL0ZJTkFMIENEIiwiYWxsQ2xpZW50SWRzIjpbIjMxMzkwYTMxLTkyMWYtNGNjNi1hNDgwLTQ3YjZmY2NmYWE4ZiIsImYzZTc5MDc2LWMyNGQtNGE4Mi04MTQ3LTRhOTM0NjgwNmQ0Zl9lbnRpdHlfMTc1NTExNjkwOTMwNl95YjAwYThwMXciLCI4MDliMzJjYS0xMDM1LTQyNjQtYWNmMC1hMjkxMGU2MTZkOWQiLCI4NDAzNTUwNy0xMjJlLTQxN2QtYWM3MC00ZDJkN2E1Mzc0OTYiLCJkNzIyMzY4Mi0xYjRjLTRmN2ItYTZlMi0xNmZhYzI3ZDM1ODAiXSwiaWF0IjoxNzczMzM1MjE3LCJleHAiOjE3NzM5NDAwMTd9.gjpb1QuPTivEPlV0A06XnXmB3-qmf-ZrmeA4jpshUg4';

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/dashboard',
      'Set-Cookie': `portal_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
    },
  });
};
