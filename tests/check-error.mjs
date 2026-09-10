async function main() {
  const r = await fetch('http://localhost:3000/hub');
  console.log('Status:', r.status);
  const text = await r.text();
  console.log('Body length:', text.length);
  const match = text.match(/"message":"([^"]+)"/);
  if (match) {
    console.log('Message:', match[1]);
  } else {
    console.log('Body sample:', text.slice(0, 500));
  }
}
main();
