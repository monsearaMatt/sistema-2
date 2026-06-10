const axios = require('axios');

async function main() {
  try {
    const res = await axios.post('http://localhost:3000/logistica/pickings/4/confirm-dispatch');
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
  }
}

main();
