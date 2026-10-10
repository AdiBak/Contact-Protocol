export default async function handler(_request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const query = "select top 160 pl_name,hostname,disc_year,pl_orbper,pl_rade,discoverymethod from pscomppars where pl_orbper > 0 and pl_rade > 0 and hostname is not null order by pl_name";
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;
    const upstream = await fetch(url, { signal: AbortSignal.timeout(5500), headers: { Accept: 'application/json' } });
    if (!upstream.ok) throw new Error(`Archive returned ${upstream.status}`);
    const rows = await upstream.json();
    const usable = rows.filter((row) => row.pl_name && Number.isFinite(Number(row.pl_orbper)) && Number.isFinite(Number(row.pl_rade)));
    if (!usable.length) throw new Error('Archive returned no usable targets');
    const target = usable[Math.floor(Math.random() * usable.length)];
    response.status(200).json({
      target: {
        name: String(target.pl_name), host: String(target.hostname || target.pl_name),
        periodDays: Number(Number(target.pl_orbper).toPrecision(4)),
        radiusEarth: Number(Number(target.pl_rade).toPrecision(3)),
        discoveryYear: Number(target.disc_year) || null,
        discoveryMethod: String(target.discoverymethod || 'Catalog observation')
      },
      source: 'NASA Exoplanet Archive — Planetary Systems Composite Parameters',
      sourceUrl: 'https://exoplanetarchive.ipac.caltech.edu/'
    });
  } catch (error) {
    console.error('Mission target fetch failed:', error.message);
    response.status(503).json({ error: 'Live target data is temporarily unavailable.' });
  }
}
