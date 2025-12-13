async function loadFlights() {
  const res = await fetch("/api/flights");
  const data = await res.json();

  console.log(data);
}

loadFlights();
