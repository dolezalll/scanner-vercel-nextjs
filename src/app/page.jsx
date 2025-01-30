'use client';

import { useEffect, useState } from 'react';
import Card from '../components/Card';
import ScanHistory from '../components/ScanHistory';

export default function Home() {
  const [lastScan, setLastScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('scanHistory')) || [];
    setScanHistory(savedHistory);
  }, []);

  const fetchTicket = async (code) => {
    try {
      const response = await fetch(`/api/verifyTicket?code=${code}`);
      const data = await response.json();
      const now = new Date();
      const time = now.toLocaleTimeString();

      const scanData = {
        code: data.code,
        placeno: data.placeno,
        promo: data.promo,
        time,
      };

      setLastScan(scanData);

      const updatedHistory = [scanData, ...scanHistory].slice(0, 10);
      setScanHistory(updatedHistory);
      localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Chyba při načítání:", error);
    }
  };

  // Příklad příjmu skenu - můžete upravit podle potřeby (např. WebSocket)
  const handleScan = () => {
    const code = prompt("Zadejte kód lístku:");
    if (code) {
      fetchTicket(code);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Ověření Lístků</h1>
      
      {/* Poslední sken */}
      <Card lastScan={lastScan} />

      {/* Tlačítko pro manuální sken */}
      <button
        onClick={handleScan}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-6"
      >
        Přijmout sken
      </button>

      {/* Historie skenů */}
      <ScanHistory scanHistory={scanHistory} />
    </div>
  );
}
