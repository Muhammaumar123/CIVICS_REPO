const MASTER_KEY = "$2a$10$xqXxBW294JunQwFIhxuJwuVeR5Oe6/MrQyrVIiqzw2Ziakq/G8xv6";
const BASE_URL = "https://api.jsonbin.io/v3/b";

const BINS = {
  bowls: "69f77d1faaba882197683a28",
  ngos: "69f77d63aaba882197683b38",
  vacancies: "69f77dae36566621a81e62fb",
};

const headers = {
  "Content-Type": "application/json",
  "X-Master-Key": MASTER_KEY,
};

export async function readBin(bin: keyof typeof BINS) {
  const res = await fetch(`${BASE_URL}/${BINS[bin]}/latest`, { headers });
  const data = await res.json();
  const records = data.record;
  if (Array.isArray(records) && records.length === 1 && records[0]?.init) return [];
  return records;
}

export async function writeBin(bin: keyof typeof BINS, data: any[]) {
  await fetch(`${BASE_URL}/${BINS[bin]}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
}
