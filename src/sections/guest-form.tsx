import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { addGuest } from '@/api/guests/addGuest';

export default function GuestForm() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [intolerance, setIntolerance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !startDate || !endDate) {
      setError('All fields are required.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await addGuest({
        id: crypto.randomUUID(),
        name,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        intolerance
      });

      setName('');
      setStartDate(undefined);
      setEndDate(undefined);
      setIntolerance(false);
    } catch (err) {
      console.error('Error adding guest:', err);
      setError('Failed to add guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4">
          <Input
            type="text"
            placeholder="Guest Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-test-id="name-input"
            required
            className="flex-1"
          />
          <DatePicker
            date={startDate}
            onDateChange={setStartDate}
            placeholder="Start Date"
            className="flex-1"
          />
          <DatePicker
            date={endDate}
            onDateChange={setEndDate}
            placeholder="End Date"
            className="flex-1"
          />
          <div className="flex items-center gap-2 flex-1">
            <input
              type="checkbox"
              id="intolerance"
              checked={intolerance}
              onChange={() => setIntolerance(!intolerance)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor="intolerance" className="text-sm font-medium">
              Food Intolerance
            </label>
          </div>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex w-full justify-center">
          <Button
            type="submit"
            data-test-id="submit-button"
            className="w-1/2"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add to Menu'}
          </Button>
        </div>
      </form>
    </div>
  );
}