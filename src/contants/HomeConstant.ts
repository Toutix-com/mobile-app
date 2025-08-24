import { Music, Drama, Dribbble, Baby, FileText, Heart } from 'lucide-react-native';
import { Category, FeaturedEvent } from '../types/appData';

export const categories: Category[] = [
  { name: 'Music', icon: Music },
  { name: 'Theater', icon: Drama },
  { name: 'Sports', icon: Dribbble },
  { name: 'Family', icon: Baby },
  { name: 'Workshops', icon: FileText },
  { name: 'Saved', icon: Heart },
];

export const featuredEvents: FeaturedEvent[] = [
  {
    id: '1',
    title: 'Moshing music fest - 2025',
    venue: 'Belgrave Music hall',
    date: 'August 13 2025 at 3:30 AM',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  },
  {
    id: '2',
    title: 'Indie Rock Concert',
    venue: 'The Garage',
    date: 'September 5 2025 at 8:00 PM',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  },
];

export const categoryOptions = ['Music', 'Theater', 'Sports', 'Family', 'Festivals', 'Workshops'];

export const allCitiesList = [
  'South Carolina', 'Indiana', 'Alabama', 'Florida', 'Georgia', 'Ohio', 'Tennessee', 'Texas', 'California', 'Washington', 'New York', 'Illinois', 'North Carolina', 'Michigan', 'Dubai'
];

export const allVenuesList = [
  'Indiana Convention Center', 'Dallas Exhibition Center', 'Los Angeles Convention Center', 'Miami Beach Convention Center', 'Grand Central Terminal', 'McCormick Place', 'Georgia World Congress Center', 'Orange County Convention Center', 'Las Vegas Convention Center', 'San Diego Convention Center', 'Phoenix Convention Center', 'Nashville Music City Center', 'Austin Convention Center', 'Denver Convention Center', 'Central Park'
]; 