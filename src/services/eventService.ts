const API_URL = 'https://uc9avpfy2a.eu-west-2.awsapprunner.com/event/query';

export const getEvents = async (offset: number, limit: number) => {
  try {
    const response = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}; 