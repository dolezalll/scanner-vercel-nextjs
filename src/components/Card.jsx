export default function Card({ lastScan }) {
    return (
      <div className="bg-blue-500 text-white p-4 rounded mb-6">
        <h2 className="text-xl font-semibold">Poslední sken</h2>
        {lastScan ? (
          <div>
            <p><strong>Kód:</strong> {lastScan.code}</p>
            <p><strong>Placeno:</strong> {lastScan.placeno}</p>
            <p><strong>Promo:</strong> {lastScan.promo}</p>
            <p><strong>Čas skenu:</strong> {lastScan.time}</p>
          </div>
        ) : (
          <p>---</p>
        )}
      </div>
    );
  }
  