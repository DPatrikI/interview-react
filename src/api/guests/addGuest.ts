export const addGuest = async (guest: { id: string; name: string; startDate: string; endDate: string, intolerance: boolean }) => {
  try {
    const response = await fetch('http://localhost:3001/guests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guest),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
}