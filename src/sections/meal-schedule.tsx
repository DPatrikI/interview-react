import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { fetchGuests } from '@/api/guests/fetchGuests';

interface Guest {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
  intolerance: boolean;
}

export default function MealSchedule() {
	const [guests, setGuests] = useState<Guest[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateDateRange = (start: string, end: string): string[] => {
		const dates: string[] = [];
		let current = new Date(start);
		const endDate = new Date(end);

		while (current <= endDate) {
			dates.push(current.toLocaleDateString('en-CA'));
			current.setDate(current.getDate() + 1);
		}
		return dates;
	};

	const groupGuestsByDate = () => {
		const groupedGuests: Record<string, Guest[]> = {};
		guests.forEach((guest) => {
			const dates = generateDateRange(guest.startDate, guest.endDate);
			dates.forEach((date) => {
				if (!groupedGuests[date]) {
					groupedGuests[date] = [];
				}
				groupedGuests[date].push(guest);
			});
		});
		return groupedGuests;
	};

	useEffect(() => {
		const loadGuests = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await fetchGuests();
				setGuests(data);
			} catch (err) {
				console.error('Error fetching guests:', err);
				setError('Failed to load guest data. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		loadGuests();
	}, []);

	const groupedGuests = groupGuestsByDate();

	return (
		<div className="mx-auto mt-10 w-full overflow-hidden rounded-lg border border-gray-200 shadow-lg">
			{error && <p className="text-red-500 text-center">{error}</p>}
			{loading ? (
				<p className="text-center">Loading...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="font-bold">Date</TableHead>
							<TableHead className="font-bold">Breakfast</TableHead>
							<TableHead className="font-bold">Lunch</TableHead>
							<TableHead className="font-bold">Dinner</TableHead>
              <TableHead className="font-bold">Food Intolerance</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.entries(groupedGuests).map(([date, guests]) => (
							<TableRow key={date}>
								<TableCell data-test-id="date">{date}</TableCell>
								<TableCell>
									<ul data-test-id="breakfast-list">
										{guests.map((guest) => (
											<li key={`${guest.id}-breakfast`}>{guest.name}</li>
										))}
									</ul>
								</TableCell>
								<TableCell>
									<ul data-test-id="lunch-list">
										{guests.map((guest) => (
											<li key={`${guest.id}-lunch`}>{guest.name}</li>
										))}
									</ul>
								</TableCell>
								<TableCell>
									<ul data-test-id="dinner-list">
										{guests.map((guest) => (
											<li key={`${guest.id}-dinner`}>{guest.name}</li>
										))}
									</ul>
								</TableCell>
                <TableCell>
									<ul data-test-id="dinner-list">
										{guests.map((guest) => (
											<li key={`${guest.id}-intoelrance`}>{guest.intolerance ? 'Yes' : 'No'}</li>
										))}
									</ul>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}