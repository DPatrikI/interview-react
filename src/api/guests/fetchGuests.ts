export const fetchGuests = async () => {
  try {
    const response = await fetch('http://localhost:3001/guests');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching guests:', error);
    throw error;
  }
}