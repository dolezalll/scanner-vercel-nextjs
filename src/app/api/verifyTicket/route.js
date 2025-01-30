import fs from 'fs';
import path from 'path';
import { log } from 'console';

function loadJSONData() {
  const filePath = path.join(process.cwd(), 'src', 'resources', 'tickets.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const records = JSON.parse(data);
    log(records)
    return records.map(record => {
      return {
        KODY: Number.parseInt(record.KODY),
        PLACENO: record.PLACENO?.trim() || 'Ne(nenalezeno)',
        PROMO: record.PROMO?.trim() || 'Zadna Sleva',
        POZNAMKA: record.POZNAMKA?.trim(),
      };
    });
  }
  catch (err) {
    console.error('Chyba při načítání JSON:', err);
    throw err
  }
}

const JSONData = loadJSONData();

export async function GET(request) {
  const code = request.nextUrl.searchParams.get('code')?.trim();

  log(`Přijatý kód: "${code}"`);

  if (!code) {
    return new Response(JSON.stringify({ error: "Chybí kód." }), { status: 400 });
  }

  if(!JSONData || JSONData.length === 0){
    log("JSONData je prázdné.");
    return new Response(JSON.stringify({ error: "Data nejsou dostupná." }), { status: 500 });
  }

  const ticket = JSONData.find(row => {
    log(row);
    return row.KODY === Number.parseInt(code);
  })

  if (!ticket) {
    log(`Kód "${code}" nebyl nalezen.`);
    return new Response(JSON.stringify({ code, status: "Neplatný", placeno: "Ne", promo: "Žádná sleva", poznamka: '' }), { status: 200 });
  }

  log(`Kód "${code}" je platný. Placeno: ${ticket["PLACENO"]}, Promo: ${ticket["PROMO"]}`);

  return new Response(JSON.stringify({
    code: code,
    status: "Platný",
    placeno: ticket.PLACENO,
    promo: ticket.PROMO,
    poznamka: ticket.POZNAMKA
  }), { status: 200 });
}
