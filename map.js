// Initialize Supabase
const supabaseUrl = 'https://bhdxsraoavajwuqvufqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZHhzcmFvYXZhand1cXZ1ZnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTEzNDIsImV4cCI6MjA1NDk2NzM0Mn0.7Kf8a-tAcAbkpk6F2VO1WFqecyQr8AhpQqUujWcNWN4';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13); // Default coordinates (London)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch and display markers
async function fetchMarkers() {
  const { data, error } = await supabase
    .from('map_data')
    .select('*');

  if (error) console.error('Error fetching markers:', error);
  else {
    data.forEach(marker => {
      L.marker([marker.latitude, marker.longitude])
        .addTo(map)
        .bindPopup(marker.description);
    });
  }
}

// Real-time updates
supabase
  .from('map_data')
  .on('INSERT', (payload) => {
    L.marker([payload.new.latitude, payload.new.longitude])
      .addTo(map)
      .bindPopup(payload.new.description);
  })
  .on('DELETE', (payload) => {
    // Remove marker logic (you'll need to track markers)
  })
  .subscribe();

// Initial fetch
fetchMarkers();