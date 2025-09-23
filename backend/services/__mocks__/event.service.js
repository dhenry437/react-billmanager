const getEventsFromDb = jest.fn(() => {
  // Return some dummy event data that your tests can use
  return [
    // Example dummy event
    {
      id: 'mockBill1',
      name: 'Mock Bill',
      description: 'A mocked bill',
      amount: 100,
      type: 'bill',
      rruleString: 'DTSTART:20250101T000000Z\nFREQ=DAILY',
    },
    {
      id: 'mockPayday1',
      name: 'Mock Payday',
      description: 'A mocked payday',
      amount: 1000,
      type: 'payday',
      rruleString: 'DTSTART:20250101T000000Z\nFREQ=WEEKLY\nBYDAY=MO',
    },
  ];
});

module.exports = {
  getEventsFromDb,
};
