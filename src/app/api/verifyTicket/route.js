import fs from 'fs';
import path from 'path';

// Načtení CSV při startu
let csvData = [];

const loadCSV = () => {
  const filePath = path.join(process.cwd(), 'src', 'public', 'data.csv');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(';');
    csvData = lines.slice(1).map(line => {
      const values = line.split(';');
      let obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || "";
      });
      return obj;
    });
    console.log(`Načteno ${csvData.length} záznamů z CSV.`);
  } catch (err) {
    console.error('Chyba při načítání CSV:', err);
  }
};

// Načíst CSV při startu serveru
loadCSV();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response(JSON.stringify({ error: "Chybí kód." }), { status: 400 });
  }

  const ticket = csvData.find(row => row['KODY'] === code);
  if (!ticket) {
    return new Response(JSON.stringify({ code, status: "Neplatný", placeno: "Ne", promo: "Žádná sleva" }), { status: 200 });
  }

  return new Response(JSON.stringify({
    code: code,
    status: "Platný",
    placeno: ticket["PLACENO"] || "Neznámé",
    promo: ticket["PROMO"] || "Neznámé"
  }), { status: 200 });
}
