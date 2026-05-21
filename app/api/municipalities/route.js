import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    // Securely resolve pathing mechanics to find file inside Vercel container roots
    const filePath = path.join(process.cwd(), 'municipalities.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Split file contents line-by-line safely handling line endings
    const lines = fileContent.split(/\r?\n/);
    const results = [];

    // Loop data rows, skipping the index header row [0]
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const [county, municipality, className] = lines[i].split(',');
      if (!municipality) continue;

      const displayLabel = `${municipality.trim()} (${county.trim()} County)`;
      
      // Filter matching queries
      if (displayLabel.toLowerCase().includes(query)) {
        results.push({
          label: displayLabel,
          municipality: municipality.trim(),
          county: county.trim(),
          class: className ? className.trim() : ''
        });
      }
      
      // Cap response size to keep typeahead processing snappy
      if (results.length >= 15) break;
    }

    return new Response(JSON.stringify({ municipalities: results }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600' // Cached safely since municipal listings are static
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}