import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Načtení CSV při startu
let csvData = [];

const loadCSV = () => {
  const filePath = path.join(process.cwd(), 'public', 'data.csv'); // Správná cesta
  try {
    let data = fs.readFileSync(filePath, 'utf8');
    
    // Odstranění BOM, pokud existuje
    data = data.replace(/^\uFEFF/, '');
    
    const records = parse(data, {
      columns: true,
      delimiter: ';',
      skip_empty_lines: true,
      trim: true,
    });

    csvData = records.map(record => ({
      KODY: record['KODY'] ? record['KODY'].trim() : "",
      PLACENO: record['PLACENO'] ? record['PLACENO'].trim() : "",
      PROMO: record['PROMO'] ? record['PROMO'].trim() : "",
    }));

    console.log(`Načteno ${csvData.length} záznamů z CSV.`);
    console.log(csvData); // Pro kontrolu dat
  } catch (err) {
    console.error('Chyba při načítání CSV:', err);
  }
};

// Načíst CSV při startu serveru
loadCSV();

export async function POST(request) {
  try {
    const body = await request.json();
    const code = body.code?.trim();

    console.log(`Přijatý kód: "${code}"`);

    if (!code) {
      return new Response(JSON.stringify({ error: "Chybí kód." }), { status: 400 });
    }

    // Kontrola, zda je csvData načtené
    if (!csvData || csvData.length === 0) {
      console.log("csvData je prázdné.");
      return new Response(JSON.stringify({ error: "Data nejsou dostupná." }), { status: 500 });
    }

    console.log(`Hledám kód "${code}" v csvData.`);

    const ticket = csvData.find(row => row['KODY'] === code);
    if (!ticket) {
      console.log(`Kód "${code}" nebyl nalezen.`);
      return new Response(JSON.stringify({ code, status: "Neplatný", placeno: "Ne", promo: "Žádná sleva" }), { status: 200 });
    }

    console.log(`Kód "${code}" je platný. Placeno: ${ticket["PLACENO"]}, Promo: ${ticket["PROMO"]}`);

    return new Response(JSON.stringify({
      code: code,
      status: "Platný",
      placeno: ticket["PLACENO"] || "NENASLO",
      promo: ticket["PROMO"] || "NENASLO"
    }), { status: 200 });

  } catch (err) {
    console.error('Chyba při zpracování POST požadavku:', err);
    return new Response(JSON.stringify({ error: "Interní chyba serveru." }), { status: 500 });
  }
}
