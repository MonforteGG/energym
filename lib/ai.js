export const getScore = async (songTitles) => {
  try {
    const response = await fetch('/api/getScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songTitles }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rhythm score:', error.message);
    throw error;
  }
};
