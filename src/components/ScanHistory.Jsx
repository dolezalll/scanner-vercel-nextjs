export default function ScanHistory({ scanHistory }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Historie skenů</h2>
        <ul className="space-y-2">
          {scanHistory.map((scan, index) => (
            <li key={index} className="bg-white p-3 rounded shadow">
              <p><strong>Kód:</strong> {scan.code}</p>
              <p><strong>Placeno:</strong> {scan.placeno}</p>
              <p><strong>Promo:</strong> {scan.promo}</p>
              <p><strong>Čas skenu:</strong> {scan.time}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  