import React, { createContext, useState, useEffect } from 'react';
import { food_list as initialFoodList, restaurants_data as initialRestaurants, restraunts_list } from '../assets/assets';
import { 
  registerUser, 
  loginUser,
  createDiningReservationApi,
  getUserDiningReservationsApi,
  getRestaurantDiningReservationsApi,
  updateDiningReservationStatusApi,
  cancelDiningReservationApi,
  settleDiningBillApi,
  getLiveEventsApi,
  bookEventTicketApi,
  checkInTicketApi,
  cancelTicketApi
} from '../apiService/api';

export const StoreContext = createContext(null);

export const DINING_VENUES = [
  {
    id: 'd1',
    name: 'The Sky Glasshouse & Lounge',
    tagline: 'Panoramic Skyline Dining & Craft Mixology',
    cuisine: 'Contemporary European, Fine Dining, Artisanal Grills',
    rating: 4.9,
    diningRating: 4.9,
    reviewsCount: 680,
    priceForTwo: 85,
    priceLevel: '$$$$',
    address: '450 Lexington Ave, 48th Floor, Midtown Manhattan, NY',
    neighborhood: 'Midtown East',
    timing: '12:00 PM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?q=80&w=1200&auto=format&fit=crop'
    ],
    discount: 'Flat 20% Off with Table Booking',
    discountPercent: 20,
    dressCode: 'Smart Casual',
    featured: true,
    vibes: ['Rooftop Views', 'Romantic Date', 'Live Saxophone'],
    amenities: ['Valet Parking', 'Cocktail Bar', 'Outdoor Sky Terrace', 'Sommelier on Duty', 'Free High-speed WiFi'],
    seatingZones: ['Rooftop Sky Lounge', 'Romantic Window Booth', 'Main Dining Hall', 'Private VIP Room'],
    description: 'Perched 48 stories above Manhattan, The Sky Glasshouse delivers bespoke European cuisine with floor-to-ceiling panoramic sunset views and award-winning wine curation.'
  },
  {
    id: 'd2',
    name: 'Osteria Botanica & Garden Bar',
    tagline: 'Lush Courtyard Dining & Handmade Heritage Pasta',
    cuisine: 'Authentic Italian, Woodfired Pizza, Truffle Specials',
    rating: 4.8,
    diningRating: 4.8,
    reviewsCount: 520,
    priceForTwo: 65,
    priceLevel: '$$$',
    address: '142 Mercer Street, SoHo, New York, NY',
    neighborhood: 'SoHo',
    timing: '11:30 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564936281291-294551497d81?q=80&w=1200&auto=format&fit=crop'
    ],
    discount: 'Flat 15% Off Total Bill',
    discountPercent: 15,
    dressCode: 'Casual Elegant',
    featured: true,
    vibes: ['Garden Courtyard', 'Candlelight', 'Pet Friendly'],
    amenities: ['Outdoor Garden Patio', 'Full Bar', 'Pet Friendly', 'Wheelchair Accessible', 'Organic Ingredients'],
    seatingZones: ['Outdoor Garden Patio', 'Rustic Greenhouse Atrium', 'Main Hall Booth', 'Wine Cellar Table'],
    description: 'An enchanting urban sanctuary in SoHo surrounded by blooming botanicals. Indulge in heritage Roman pasta dishes, charred sourdough Neapolitan pizza, and natural Italian spritzes.'
  },
  {
    id: 'd3',
    name: 'Kyoto Velvet Japanese Robata & Sushi',
    tagline: 'Artisanal Omakase, Wagyu Robata & Rare Sakes',
    cuisine: 'Japanese, Premium Sushi, Robata Charcoal Grills',
    rating: 4.9,
    diningRating: 4.9,
    reviewsCount: 430,
    priceForTwo: 110,
    priceLevel: '$$$$',
    address: '88 Hudson Yards, New York, NY',
    neighborhood: 'Hudson Yards',
    timing: '5:00 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1200&auto=format&fit=crop'
    ],
    discount: 'Complimentary Chef Starter & 25% Off',
    discountPercent: 25,
    dressCode: 'Formal / Elegant',
    featured: true,
    vibes: ['Omakase Counter', 'Intimate Lighting', 'Luxury Dining'],
    amenities: ['Chef Counter Seating', 'Valet Service', 'Private Dining Tatami Rooms', 'Rare Japanese Whiskey Bar'],
    seatingZones: ['Omakase Counter', 'Private Tatami Room', 'Main Velvet Lounge', 'Binchotan Grill Counter'],
    description: 'Experience pure culinary mastery featuring fresh bluefin tuna flown in daily from Tokyo Toyosu Market, A5 Miyazaki Wagyu, and an exquisite collection of rare junmai daiginjo sakes.'
  },
  {
    id: 'd4',
    name: 'Le Grand Boulevard Parisian Brasserie',
    tagline: 'Timeless French Flavors & Boulevard Charm',
    cuisine: 'French Classic, Seafood Platters, Prime Steaks',
    rating: 4.7,
    diningRating: 4.7,
    reviewsCount: 390,
    priceForTwo: 70,
    priceLevel: '$$$',
    address: '210 5th Avenue, Flatiron District, New York, NY',
    neighborhood: 'Flatiron',
    timing: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?q=80&w=1200&auto=format&fit=crop'
    ],
    discount: 'Flat 20% Off with Table Booking',
    discountPercent: 20,
    dressCode: 'Smart Casual',
    featured: false,
    vibes: ['Parisian Ambience', 'Weekend Brunch', 'Outdoor Sidewalk'],
    amenities: ['Sidewalk Bistro Tables', 'Oyster Bar', 'Artisanal Bakery Counter', 'Cocktail Lounge'],
    seatingZones: ['Sidewalk Boulevard Patio', 'Bistro Main Hall', 'Oyster Bar Counter', 'Cozy Booth'],
    description: 'Immerse yourself in authentic Parisian brasserie culture with steak frites with Café de Paris butter, escargot, chilled seafood towers, and decadent freshly baked tarte tatin.'
  },
  {
    id: 'd5',
    name: 'Saffron Heritage Royal Dining',
    tagline: 'Grand Nizami & Awadhi Royal Gastronomy',
    cuisine: 'North Indian, Awadhi Biryani, Tandoori Specialties',
    rating: 4.8,
    diningRating: 4.8,
    reviewsCount: 610,
    priceForTwo: 55,
    priceLevel: '$$',
    address: '320 West 46th St, Restaurant Row, New York, NY',
    neighborhood: 'Hell\'s Kitchen',
    timing: '12:00 PM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1200&auto=format&fit=crop'
    ],
    discount: 'Flat 30% Off Food Bill',
    discountPercent: 30,
    dressCode: 'Casual',
    featured: true,
    vibes: ['Royal Courtyard', 'Live Instrumental Music', 'Family Feast'],
    amenities: ['Buffet on Weekends', 'Live Tandoor Station', 'Family Banquets', 'Vegetarian & Jain Friendly'],
    seatingZones: ['Royal Courtyard Booth', 'Main Dining Hall', 'Private Family Enclosure'],
    description: 'A celebration of royal Indian culinary heritage. Slow-cooked dum biryanis, velvet dal makhani simmered for 24 hours, and succulent tandoori kebabs served in an opulent, handcrafted dining space.'
  },
  {
    id: 'd6',
    name: 'The Copper Kettle Taproom & Brewhouse',
    tagline: 'Microbrewery, Live Indie Gigs & Gourmet Bites',
    cuisine: 'Craft Beers, Smash Burgers, Artisanal Wood Smoke Grills',
    rating: 4.6,
    diningRating: 4.6,
    reviewsCount: 310,
    priceForTwo: 40,
    priceLevel: '$$',
    address: '74 Wythe Ave, Williamsburg, Brooklyn, NY',
    neighborhood: 'Williamsburg',
    timing: '3:00 PM – 1:00 AM',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop'
    ],
    discount: '1+1 on Craft Brews + 15% Off Food',
    discountPercent: 15,
    dressCode: 'Casual',
    featured: false,
    vibes: ['Live Music Gigs', 'Beer Garden', 'Friends Gathering'],
    amenities: ['Open-air Beer Garden', '16 Craft Taps', 'Pool Table & Arcade', 'Dog Friendly Patio'],
    seatingZones: ['Beer Garden Bench', 'High-Top Bar Counter', 'Stage View Table', 'Indoor Lounge'],
    description: 'Williamsburg\'s premier independent brewhouse pouring 16 rotating house-brewed IPAs and stouts paired with dry-aged smash burgers, smoked brisket nachos, and energetic weekend live gigs.'
  }
];

const INITIAL_DINING_RESERVATIONS = [
  {
    id: 'DINE-2041',
    bookingReference: 'TOM-DINE-8821',
    restaurantId: 'd1',
    restaurantName: 'The Sky Glasshouse & Lounge',
    restaurantAddress: '450 Lexington Ave, 48th Floor, Midtown Manhattan, NY',
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '7:30 PM',
    mealType: 'DINNER',
    guestCount: 2,
    seatingArea: 'ROOFTOP_TERRACE',
    occasion: 'DATE_NIGHT',
    specialRequests: 'Window table facing city skyline, anniversary celebration',
    guestName: 'Sarah Jenkins',
    guestPhone: '+1 (555) 234-8901',
    guestEmail: 'sarah.jenkins@example.com',
    status: 'CONFIRMED',
    tableNumber: 'R-12',
    discountPercent: 20,
    billAmount: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'DINE-2039',
    bookingReference: 'TOM-DINE-5519',
    restaurantId: 'd2',
    restaurantName: 'Osteria Botanica & Garden Bar',
    restaurantAddress: '142 Mercer Street, SoHo, New York, NY',
    restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    time: '1:00 PM',
    mealType: 'LUNCH',
    guestCount: 4,
    seatingArea: 'GARDEN_PATIO',
    occasion: 'FAMILY_GATHERING',
    specialRequests: 'High chair for toddler please',
    guestName: 'Michael Chang',
    guestPhone: '+1 (555) 789-0123',
    guestEmail: 'michael.c@example.com',
    status: 'CONFIRMED',
    tableNumber: 'P-04',
    discountPercent: 15,
    billAmount: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'DINE-2018',
    bookingReference: 'TOM-DINE-1120',
    restaurantId: 'd3',
    restaurantName: 'Kyoto Velvet Japanese Robata & Sushi',
    restaurantAddress: '88 Hudson Yards, New York, NY',
    restaurantImage: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=1200&auto=format&fit=crop',
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    time: '8:00 PM',
    mealType: 'DINNER',
    guestCount: 2,
    seatingArea: 'ROMANTIC_WINDOW',
    occasion: 'ANNIVERSARY',
    specialRequests: 'Quiet romantic corner',
    guestName: 'Sarah Jenkins',
    guestPhone: '+1 (555) 234-8901',
    guestEmail: 'sarah.jenkins@example.com',
    status: 'COMPLETED',
    tableNumber: 'W-02',
    discountPercent: 25,
    billAmount: 145.0,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  }
];

export const LIVE_EVENTS_DATA = [
  {
    id: 'evt-1',
    title: 'Neon Sunset Rooftop Electronic Fest',
    tagline: 'Deep House, Sunset Cocktails & Skyline Laser Visuals',
    category: 'CONCERT',
    categoryLabel: 'Music & Electronic',
    artistName: 'Kavinsky & Nora En Pure (Live Set)',
    venueName: 'The Brooklyn Mirage & Rooftop Sky Deck',
    venueAddress: '140 Stewart Ave, Brooklyn, NY',
    neighborhood: 'Williamsburg',
    eventDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    dateDisplay: 'Sat, Mar 15 • 6:00 PM',
    startTime: '18:00:00',
    endTime: '02:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    minPrice: 35,
    totalCapacity: 800,
    availableTickets: 68,
    status: 'SELLING_FAST',
    featured: true,
    tags: ['Electronic', 'Rooftop', 'Sunset DJ', 'Craft Cocktails'],
    description: 'An open-air electronic sunset feast featuring world-class melodic deep house, immersive 3D projection mapping, artisan food trucks, and craft cocktail bars overlooking the Manhattan skyline.',
    ticketTiers: [
      { id: 't1', name: 'General Admission (GA)', price: 35, desc: 'Full access to main open-air arena and food truck pavilion' },
      { id: 't2', name: 'VIP Sky Deck Pass', price: 75, desc: 'Priority express entry, elevated VIP lounge view, and 2 complimentary cocktails' },
      { id: 't3', name: 'VIP Table for 4 + Bottle Service', price: 280, desc: 'Private reserved booth, premium spirit bottle, dedicated hostess, and fast-track entry' }
    ]
  },
  {
    id: 'evt-2',
    title: 'Taste of New York Gourmet Food & Wine Fair',
    tagline: 'Over 40 Award-Winning Chefs, Wine Tastings & Live Jazz',
    category: 'FOOD_FESTIVAL',
    categoryLabel: 'Food & Wine Festival',
    artistName: 'Curated by Michelin Star Guest Chefs & Sommelier Guild',
    venueName: 'Pier 57 Rooftop & Hudson River Esplanade',
    venueAddress: '25 11th Ave, Chelsea, New York, NY',
    neighborhood: 'Meatpacking District',
    eventDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    dateDisplay: 'Sun, Mar 16 • 12:00 PM',
    startTime: '12:00:00',
    endTime: '20:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    minPrice: 45,
    totalCapacity: 1200,
    availableTickets: 140,
    status: 'AVAILABLE',
    featured: true,
    tags: ['Food Festival', 'Wine Tasting', 'Live Jazz', 'Artisanal Cheeses'],
    description: 'The premier culinary gathering of the season. Savor exclusive tasting portions from NYC’s finest restaurants, taste over 150 international natural wines and craft ciders, and enjoy live afternoon gypsy jazz by the water.',
    ticketTiers: [
      { id: 't1', name: 'Tasting Pass (10 Food Tokens)', price: 45, desc: 'Entry pass plus 10 tokens redeemable at any chef tasting counter' },
      { id: 't2', name: 'All-Inclusive Wine & Food VIP', price: 95, desc: 'Unlimited wine tastings, VIP lounge seating, souvenir crystal tasting glass, and early 11 AM entry' }
    ]
  },
  {
    id: 'evt-3',
    title: 'Midnight Laughs Standup Comedy Gala',
    tagline: 'Top Netflix & Comedy Central Headliners Live',
    category: 'COMEDY',
    categoryLabel: 'Standup Comedy',
    artistName: 'Hasan Minhaj & Special Celebrity Guests',
    venueName: 'The Gramercy Theatre & Lounge',
    venueAddress: '127 E 23rd St, New York, NY',
    neighborhood: 'Gramercy',
    eventDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    dateDisplay: 'Fri, Mar 14 • 8:00 PM',
    startTime: '20:00:00',
    endTime: '22:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    minPrice: 40,
    totalCapacity: 500,
    availableTickets: 24,
    status: 'ALMOST_FULL',
    featured: true,
    tags: ['Standup', 'Celebrity Lineup', 'Cocktail Lounge', '18+'],
    description: 'Get ready for an unhinged night of belly-aching laughter with nationally acclaimed comics. Ticket includes table-side cocktail and small bites service throughout the performance.',
    ticketTiers: [
      { id: 't1', name: 'Standard Reserved Seating', price: 40, desc: 'Guaranteed seat with full cocktail service' },
      { id: 't2', name: 'Front Row Ringside Table', price: 65, desc: 'Up-close front tables with priority artist interaction and complimentary dessert' }
    ]
  },
  {
    id: 'evt-4',
    title: 'Artisanal Pasta & Tuscan Wine Masterclass',
    tagline: 'Handmade Gnocchi, Ravioli & Wine Pairing with Chef Marco',
    category: 'WORKSHOP',
    categoryLabel: 'Culinary Masterclass',
    artistName: 'Executive Chef Marco Bellini (Florence Culinary Academy)',
    venueName: 'Eataly Downtown Chef Academy',
    venueAddress: '101 Liberty St, 3rd Floor, New York, NY',
    neighborhood: 'Financial District',
    eventDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    dateDisplay: 'Tue, Mar 18 • 6:30 PM',
    startTime: '18:30:00',
    endTime: '21:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
    minPrice: 85,
    totalCapacity: 30,
    availableTickets: 6,
    status: 'SELLING_FAST',
    featured: false,
    tags: ['Hands-on Cooking', 'Italian Pasta', 'Wine Pairing', 'Small Batch'],
    description: 'A hands-on interactive 3-hour masterclass. Learn how to mix, knead, roll, and shape heritage Roman and Tuscan pasta from scratch, accompanied by Chianti Classico pairings and a sit-down 3-course dinner.',
    ticketTiers: [
      { id: 't1', name: 'Individual Chef Station', price: 85, desc: 'Dedicated workstation, chef apron, recipe book, and 3-course wine dinner' },
      { id: 't2', name: 'Couple Workstation Package', price: 160, desc: 'Shared bench for two, includes gift bottle of aged extra virgin olive oil and pasta roller kit' }
    ]
  },
  {
    id: 'evt-5',
    title: 'Acoustic Soul & Candlelight Sessions',
    tagline: 'Intimate Unplugged Indie & Soul under 1,000 Candles',
    category: 'ROOFTOP_GIG',
    categoryLabel: 'Acoustic & Candlelight',
    artistName: 'The Brooklyn Strings Quartet & Maya Sol',
    venueName: 'The Beekman Courtyard Atrium',
    venueAddress: '123 Nassau St, New York, NY',
    neighborhood: 'Lower Manhattan',
    eventDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    dateDisplay: 'Mon, Mar 17 • 7:30 PM',
    startTime: '19:30:00',
    endTime: '21:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    minPrice: 30,
    totalCapacity: 180,
    availableTickets: 32,
    status: 'AVAILABLE',
    featured: false,
    tags: ['Candlelight', 'Acoustic', 'Atmospheric', 'Wine Bar'],
    description: 'Experience timeless soul, Fleetwood Mac, and jazz classics bathed in the warm, flickering radiance of over a thousand candles inside an iconic Victorian atrium.',
    ticketTiers: [
      { id: 't1', name: 'Balcony Mezzanine Seat', price: 30, desc: 'Sweeping atmospheric view of the candle-lit atrium floor' },
      { id: 't2', name: 'Main Floor Candlelight Seating', price: 55, desc: 'Immersive seating inside the candle perimeter with complimentary glass of Prosecco' }
    ]
  },
  {
    id: 'evt-6',
    title: 'Velvet Disco & Retro Funk Club Night',
    tagline: '70s & 80s Disco Anthems, Roller Skaters & Craft Punch Bowls',
    category: 'NIGHTLIFE',
    categoryLabel: 'Club & DJ Sets',
    artistName: 'DJ Disco Diva & The Funky Groovers',
    venueName: 'House of Yes Spectacular',
    venueAddress: '2 Wyckoff Ave, Bushwick, Brooklyn, NY',
    neighborhood: 'Bushwick',
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    dateDisplay: 'Sat, Mar 22 • 10:00 PM',
    startTime: '22:00:00',
    endTime: '04:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    minPrice: 25,
    totalCapacity: 600,
    availableTickets: 90,
    status: 'AVAILABLE',
    featured: false,
    tags: ['Disco', 'Costume Party', 'Live Performers', 'Nightlife'],
    description: 'Dust off your sequins and bell bottoms for Brooklyn’s wildest retro disco celebration with aerialists, mirror ball extravagance, and non-stop funk rhythms till sunrise.',
    ticketTiers: [
      { id: 't1', name: 'Late Night Dance Pass', price: 25, desc: 'Entry anytime after 10 PM' },
      { id: 't2', name: 'Express VIP + Welcome Punch', price: 45, desc: 'Skip the line, coat check included, and a signature spiked tropical punch' }
    ]
  }
];

const INITIAL_EVENT_TICKETS = [
  {
    id: 'TCK-9012',
    eventId: 'evt-1',
    eventTitle: 'Neon Sunset Rooftop Electronic Fest',
    eventArtist: 'Kavinsky & Nora En Pure (Live Set)',
    eventVenue: 'The Brooklyn Mirage & Rooftop Sky Deck',
    eventAddress: '140 Stewart Ave, Brooklyn, NY',
    eventDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    eventStartTime: '18:00:00',
    eventImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    ticketTier: 'VIP Sky Deck Pass',
    quantity: 2,
    unitPrice: 75,
    totalAmount: 150,
    bookingReference: 'TOM-EVT-7721',
    attendeeName: 'Sarah Jenkins',
    attendeePhone: '+1 (555) 234-8901',
    attendeeEmail: 'sarah.jenkins@example.com',
    status: 'CONFIRMED',
    foodVoucherIncluded: true,
    purchaseDate: new Date(Date.now() - 86400000).toISOString(),
    entryGate: 'Gate A - VIP Fast Track'
  },
  {
    id: 'TCK-9008',
    eventId: 'evt-3',
    eventTitle: 'Midnight Laughs Standup Comedy Gala',
    eventArtist: 'Hasan Minhaj & Special Celebrity Guests',
    eventVenue: 'The Gramercy Theatre & Lounge',
    eventAddress: '127 E 23rd St, New York, NY',
    eventDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    eventStartTime: '20:00:00',
    eventImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    ticketTier: 'Standard Reserved Seating',
    quantity: 1,
    unitPrice: 40,
    totalAmount: 40,
    bookingReference: 'TOM-EVT-4402',
    attendeeName: 'Sarah Jenkins',
    attendeePhone: '+1 (555) 234-8901',
    attendeeEmail: 'sarah.jenkins@example.com',
    status: 'CONFIRMED',
    foodVoucherIncluded: false,
    purchaseDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    entryGate: 'Main Entrance - Orchestra Row F'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-1092',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 234-8901',
    deliveryAddress: '123 Elm Street, Apt 4B, New York, NY',
    restaurantId: '1',
    restaurantName: 'Delicious Bites',
    items: [
      { id: '1', name: 'Greek salad', price: 12, quantity: 2 },
      { id: '27', name: 'Creamy Pasta', price: 16, quantity: 1 },
    ],
    subtotal: 40.0,
    deliveryFee: 2.0,
    tax: 2.0,
    discount: 4.0,
    totalAmount: 40.0,
    status: 'PREPARING', // 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED'
    paymentMethod: 'Credit Card',
    paymentStatus: 'PAID',
    etaMinutes: 20,
    driverName: 'Alex Turner',
    driverPhone: '+1 (555) 902-3344',
  },
  {
    id: 'ORD-1091',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    customerName: 'Michael Chang',
    customerPhone: '+1 (555) 789-0123',
    deliveryAddress: '456 Grand Ave, Suite 12, New York, NY',
    restaurantId: '1',
    restaurantName: 'Delicious Bites',
    items: [
      { id: '4', name: 'Chicken Salad', price: 24, quantity: 1 },
      { id: '26', name: 'Tomato Pasta', price: 18, quantity: 1 },
    ],
    subtotal: 42.0,
    deliveryFee: 2.0,
    tax: 2.1,
    discount: 0.0,
    totalAmount: 46.1,
    status: 'OUT_FOR_DELIVERY',
    paymentMethod: 'UPI / Online',
    paymentStatus: 'PAID',
    etaMinutes: 8,
    driverName: 'Carlos Morales',
    driverPhone: '+1 (555) 441-8977',
  },
  {
    id: 'ORD-1088',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    customerName: 'Emily Watson',
    customerPhone: '+1 (555) 321-7654',
    deliveryAddress: '789 Broadway Blvd, New York, NY',
    restaurantId: '2',
    restaurantName: 'Pizza Hut',
    items: [
      { id: '2', name: 'Veg salad', price: 18, quantity: 2 },
    ],
    subtotal: 36.0,
    deliveryFee: 2.0,
    tax: 1.8,
    discount: 5.0,
    totalAmount: 34.8,
    status: 'DELIVERED',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'PAID',
    etaMinutes: 0,
    driverName: 'James Wilson',
    driverPhone: '+1 (555) 888-2311',
  },
];

const StoreContextProvider = (props) => {
  // Food Catalog State
  const [food_list, setFoodList] = useState(initialFoodList);
  const [restaurants_data, setRestaurantsData] = useState(initialRestaurants);
  
  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('food_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('food_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Table Bookings State
  const [tableBookings, setTableBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('food_table_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dining Reservations State (Rich Experience)
  const [diningReservations, setDiningReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('food_dining_reservations');
      return saved ? JSON.parse(saved) : INITIAL_DINING_RESERVATIONS;
    } catch {
      return INITIAL_DINING_RESERVATIONS;
    }
  });

  // Save Dining Reservations to LocalStorage
  useEffect(() => {
    localStorage.setItem('food_dining_reservations', JSON.stringify(diningReservations));
  }, [diningReservations]);

  // Live Event Tickets State
  const [eventTickets, setEventTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('food_event_tickets');
      return saved ? JSON.parse(saved) : INITIAL_EVENT_TICKETS;
    } catch {
      return INITIAL_EVENT_TICKETS;
    }
  });

  // Save Event Tickets to LocalStorage
  useEffect(() => {
    localStorage.setItem('food_event_tickets', JSON.stringify(eventTickets));
  }, [eventTickets]);

  // Applied Promo Code
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Authentication & RBAC
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('user_role') || 'CUSTOMER'); // 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN'
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      return saved ? JSON.parse(saved) : { name: 'Demo User', email: 'demo@foodapp.com' };
    } catch {
      return { name: 'Demo User', email: 'demo@foodapp.com' };
    }
  });
  const [loading, setLoading] = useState(false);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('food_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save Orders to LocalStorage
  useEffect(() => {
    localStorage.setItem('food_orders', JSON.stringify(orders));
  }, [orders]);

  // Save Table Bookings
  useEffect(() => {
    localStorage.setItem('food_table_bookings', JSON.stringify(tableBookings));
  }, [tableBookings]);

  // Cart Operations
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const deleteFromCart = (itemId) => {
    setCartItems((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const clearCart = () => {
    setCartItems({});
    setAppliedPromo(null);
  };

  const getTotalCartAmount = () => {
    let subtotal = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((p) => String(p._id) === String(itemId));
        if (item) {
          subtotal += item.price * cartItems[itemId];
        }
      }
    }
    return Number(subtotal.toFixed(2));
  };

  const applyPromoCode = (code) => {
    if (!code) return { success: false, message: 'Please enter a promo code.' };
    const normalized = code.trim().toUpperCase();
    if (normalized === 'SAVE10') {
      const discountPercent = 10;
      setAppliedPromo({ code: 'SAVE10', type: 'percent', value: discountPercent });
      return { success: true, message: '10% discount applied!' };
    }
    if (normalized === 'WELCOME50') {
      setAppliedPromo({ code: 'WELCOME50', type: 'fixed', value: 5.0 });
      return { success: true, message: '$5.00 discount applied!' };
    }
    return { success: false, message: 'Invalid or expired promo code. Try "SAVE10" or "WELCOME50".' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Order Operations
  const createOrder = (orderPayload) => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 50 ? 0.0 : 2.0;
    const tax = Number((subtotal * 0.05).toFixed(2));
    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') {
        discount = Number(((subtotal * appliedPromo.value) / 100).toFixed(2));
      } else {
        discount = appliedPromo.value;
      }
    }
    const finalTotal = Math.max(0, Number((subtotal + deliveryFee + tax - discount).toFixed(2)));

    // Extract item details
    const orderItems = [];
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((p) => String(p._id) === String(itemId));
        if (item) {
          orderItems.push({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: cartItems[itemId],
            image: item.image,
          });
        }
      }
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      customerName: `${orderPayload.firstName || ''} ${orderPayload.lastName || ''}`.trim() || userProfile.name,
      customerPhone: orderPayload.phone || '+1 (555) 000-1122',
      customerEmail: orderPayload.email || userProfile.email,
      deliveryAddress: `${orderPayload.street || ''}, ${orderPayload.city || ''}, ${orderPayload.state || ''} ${orderPayload.pinCode || ''}`,
      restaurantId: '1',
      restaurantName: 'Delicious Bites',
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      discount,
      totalAmount: finalTotal,
      status: 'CONFIRMED',
      paymentMethod: orderPayload.paymentMethod || 'Credit Card',
      paymentStatus: 'PAID',
      deliveryInstructions: orderPayload.instructions || 'Standard delivery',
      etaMinutes: 30,
      driverName: 'Assigned upon preparation',
      driverPhone: 'Pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          let updatedEta = o.etaMinutes;
          if (newStatus === 'PREPARING') updatedEta = 20;
          if (newStatus === 'READY_FOR_PICKUP') updatedEta = 15;
          if (newStatus === 'OUT_FOR_DELIVERY') updatedEta = 10;
          if (newStatus === 'DELIVERED') updatedEta = 0;
          if (newStatus === 'CANCELED') updatedEta = 0;

          return {
            ...o,
            status: newStatus,
            etaMinutes: updatedEta,
            driverName: newStatus === 'OUT_FOR_DELIVERY' && o.driverName.includes('Assigned') ? 'Marcus Sterling' : o.driverName,
            driverPhone: newStatus === 'OUT_FOR_DELIVERY' ? '+1 (555) 872-9100' : o.driverPhone,
          };
        }
        return o;
      })
    );
  };

  const cancelOrder = (orderId, reason = 'Customer request') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELED', cancelReason: reason } : o))
    );
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  // Table Reservation (Legacy support)
  const bookTable = (bookingData) => {
    const booking = {
      id: `RES-${Date.now()}`,
      ...bookingData,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };
    setTableBookings((prev) => [booking, ...prev]);
    return booking;
  };

  // Comprehensive Dining & Table Reservations
  const bookDiningTable = async (bookingData) => {
    const bookingRef = 'TOM-DINE-' + Math.floor(1000 + Math.random() * 9000);
    const newReservation = {
      id: `DINE-${Date.now()}`,
      bookingReference: bookingRef,
      restaurantId: bookingData.restaurantId || 'd1',
      restaurantName: bookingData.restaurantName || 'The Sky Glasshouse & Lounge',
      restaurantAddress: bookingData.restaurantAddress || '450 Lexington Ave, 48th Floor, New York',
      restaurantImage: bookingData.restaurantImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      date: bookingData.date || new Date().toISOString().split('T')[0],
      time: bookingData.time || '7:30 PM',
      mealType: bookingData.mealType || 'DINNER',
      guestCount: Number(bookingData.guestCount) || 2,
      seatingArea: bookingData.seatingArea || 'MAIN_DINING',
      occasion: bookingData.occasion || 'CASUAL',
      specialRequests: bookingData.specialRequests || '',
      guestName: bookingData.guestName || userProfile?.name || 'Valued Guest',
      guestPhone: bookingData.guestPhone || '+1 (555) 234-8901',
      guestEmail: bookingData.guestEmail || userProfile?.email || 'guest@foodapp.com',
      status: 'CONFIRMED',
      tableNumber: bookingData.tableNumber || '',
      discountPercent: bookingData.discountPercent || 0,
      billAmount: null,
      createdAt: new Date().toISOString(),
    };

    // Attempt backend sync
    try {
      const backendDto = {
        restaurantId: isNaN(Number(newReservation.restaurantId)) ? 1 : Number(newReservation.restaurantId),
        userId: 1,
        bookingDate: newReservation.date,
        bookingTime: '19:30:00',
        guestCount: newReservation.guestCount,
        mealType: newReservation.mealType,
        seatingArea: newReservation.seatingArea,
        occasion: newReservation.occasion,
        specialRequests: newReservation.specialRequests,
        guestName: newReservation.guestName,
        guestPhone: newReservation.guestPhone,
        guestEmail: newReservation.guestEmail,
        discountPercent: newReservation.discountPercent,
      };
      const apiResult = await createDiningReservationApi(backendDto);
      if (apiResult && apiResult.id) {
        newReservation.backendId = apiResult.id;
        if (apiResult.bookingReference) {
          newReservation.bookingReference = apiResult.bookingReference;
        }
      }
    } catch (e) {
      console.warn('Backend reservation call skipped, running client mode:', e);
    }

    setDiningReservations((prev) => [newReservation, ...prev]);
    setTableBookings((prev) => [newReservation, ...prev]);
    return newReservation;
  };

  const cancelDiningReservation = async (reservationId) => {
    setDiningReservations((prev) =>
      prev.map((res) => (res.id === reservationId ? { ...res, status: 'CANCELLED' } : res))
    );
    setTableBookings((prev) =>
      prev.map((res) => (res.id === reservationId ? { ...res, status: 'CANCELLED' } : res))
    );
    try {
      await cancelDiningReservationApi(reservationId);
    } catch (e) {
      // Ignored
    }
  };

  const updateDiningReservationStatus = async (reservationId, newStatus, tableNumber, billAmount) => {
    setDiningReservations((prev) =>
      prev.map((res) => {
        if (res.id === reservationId) {
          return {
            ...res,
            status: newStatus || res.status,
            tableNumber: tableNumber !== undefined ? tableNumber : res.tableNumber,
            billAmount: billAmount !== undefined ? billAmount : res.billAmount,
          };
        }
        return res;
      })
    );
    try {
      await updateDiningReservationStatusApi(reservationId, newStatus, tableNumber);
    } catch (e) {
      // Ignored
    }
  };

  const payDiningBill = async (reservationId, { billAmount, tipAmount = 0, paymentMethod = 'Card' }) => {
    const reservation = diningReservations.find((r) => r.id === reservationId);
    const discount = reservation?.discountPercent ? (billAmount * reservation.discountPercent) / 100 : 0;
    const finalTotal = Math.max(0, billAmount - discount + tipAmount);

    setDiningReservations((prev) =>
      prev.map((res) => {
        if (res.id === reservationId) {
          return {
            ...res,
            status: 'COMPLETED',
            billAmount: finalTotal,
            originalBillAmount: billAmount,
            discountApplied: discount,
            tipAmount,
            paymentMethod,
            paidAt: new Date().toISOString(),
          };
        }
        return res;
      })
    );

    try {
      await settleDiningBillApi(reservationId, finalTotal);
    } catch (e) {
      // Ignored
    }

    return { success: true, finalTotal, discount, tipAmount };
  };

  const getDiningVenueById = (id) => {
    return DINING_VENUES.find((v) => String(v.id) === String(id));
  };

  // Live Events & Ticketing Methods
  const bookEventTicket = async (ticketData) => {
    const bookingRef = 'TOM-EVT-' + Math.floor(1000 + Math.random() * 9000);
    const newTicket = {
      id: `TCK-${Date.now()}`,
      eventId: ticketData.eventId,
      eventTitle: ticketData.eventTitle,
      eventArtist: ticketData.eventArtist,
      eventVenue: ticketData.eventVenue,
      eventAddress: ticketData.eventAddress,
      eventDate: ticketData.eventDate,
      eventStartTime: ticketData.eventStartTime || '19:00:00',
      eventImageUrl: ticketData.eventImageUrl,
      ticketTier: ticketData.ticketTier,
      quantity: Number(ticketData.quantity) || 1,
      unitPrice: Number(ticketData.unitPrice),
      totalAmount: Number(ticketData.totalAmount),
      bookingReference: bookingRef,
      attendeeName: ticketData.attendeeName || userProfile?.name || 'Valued Guest',
      attendeePhone: ticketData.attendeePhone || '+1 (555) 234-8901',
      attendeeEmail: ticketData.attendeeEmail || userProfile?.email || 'guest@foodapp.com',
      status: 'CONFIRMED',
      foodVoucherIncluded: Boolean(ticketData.foodVoucherIncluded),
      purchaseDate: new Date().toISOString(),
      entryGate: ticketData.entryGate || 'Gate A - Fast Track Entry',
    };

    try {
      const backendDto = {
        eventId: isNaN(Number(newTicket.eventId)) ? 1 : Number(newTicket.eventId),
        userId: 1,
        ticketTier: newTicket.ticketTier,
        quantity: newTicket.quantity,
        unitPrice: newTicket.unitPrice,
        totalAmount: newTicket.totalAmount,
        attendeeName: newTicket.attendeeName,
        attendeePhone: newTicket.attendeePhone,
        attendeeEmail: newTicket.attendeeEmail,
        foodVoucherIncluded: newTicket.foodVoucherIncluded,
      };
      const apiResult = await bookEventTicketApi(backendDto);
      if (apiResult && apiResult.id) {
        newTicket.backendId = apiResult.id;
        if (apiResult.bookingReference) {
          newTicket.bookingReference = apiResult.bookingReference;
        }
      }
    } catch (e) {
      console.warn('Backend ticket call skipped, running client mode:', e);
    }

    setEventTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const cancelEventTicket = async (ticketId) => {
    setEventTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'CANCELLED' } : t))
    );
    try {
      await cancelTicketApi(ticketId);
    } catch (e) {
      // Ignored
    }
  };

  const checkInEventTicket = async (ticketId) => {
    setEventTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'CHECKED_IN' } : t))
    );
    try {
      await checkInTicketApi(ticketId);
    } catch (e) {
      // Ignored
    }
  };

  const getLiveEventById = (id) => {
    return LIVE_EVENTS_DATA.find((e) => String(e.id) === String(id));
  };

  // Menu Management for Restaurant Owners
  const addFoodItem = (newItem) => {
    const dish = {
      _id: String(Date.now()),
      ...newItem,
    };
    setFoodList((prev) => [dish, ...prev]);
    return dish;
  };

  const updateFoodItem = (id, updatedFields) => {
    setFoodList((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteFoodItem = (id) => {
    setFoodList((prev) => prev.filter((item) => item._id !== id));
  };

  // Auth Functions
  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      const response = await registerUser(userData);
      const generatedToken = response?.token || `jwt-${Date.now()}`;
      setToken(generatedToken);
      localStorage.setItem('token', generatedToken);
      setUserRole(userData.role || 'CUSTOMER');
      localStorage.setItem('user_role', userData.role || 'CUSTOMER');
      const profile = { name: userData.fullName || userData.username, email: userData.email };
      setUserProfile(profile);
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return { success: true, token: generatedToken };
    } catch (err) {
      // Demo Fallback for resilience
      const fallbackToken = `jwt-demo-${Date.now()}`;
      setToken(fallbackToken);
      localStorage.setItem('token', fallbackToken);
      setUserRole(userData.role || 'CUSTOMER');
      localStorage.setItem('user_role', userData.role || 'CUSTOMER');
      const profile = { name: userData.fullName || userData.username, email: userData.email };
      setUserProfile(profile);
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return { success: true, token: fallbackToken };
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData) => {
    setLoading(true);
    try {
      const response = await loginUser(userData);
      const jwtToken = response?.token || `jwt-${Date.now()}`;
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
      const assignedRole = userData.role || (userData.email.includes('admin') ? 'ADMIN' : userData.email.includes('owner') ? 'RESTAURANT_OWNER' : 'CUSTOMER');
      setUserRole(assignedRole);
      localStorage.setItem('user_role', assignedRole);
      const profile = { name: userData.email.split('@')[0], email: userData.email };
      setUserProfile(profile);
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return { success: true, token: jwtToken };
    } catch (err) {
      // Demo fallback
      const fallbackToken = `jwt-demo-${Date.now()}`;
      setToken(fallbackToken);
      localStorage.setItem('token', fallbackToken);
      const assignedRole = userData.role || (userData.email.includes('admin') ? 'ADMIN' : userData.email.includes('owner') ? 'RESTAURANT_OWNER' : 'CUSTOMER');
      setUserRole(assignedRole);
      localStorage.setItem('user_role', assignedRole);
      const profile = { name: userData.email.split('@')[0], email: userData.email };
      setUserProfile(profile);
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return { success: true, token: fallbackToken };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUserRole('CUSTOMER');
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
  };

  const switchRole = (role) => {
    setUserRole(role);
    localStorage.setItem('user_role', role);
  };

  const contextValue = {
    food_list,
    restaurants_data,
    restraunts_list,
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    getTotalCartAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    orders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderById,
    tableBookings,
    bookTable,
    diningVenues: DINING_VENUES,
    diningReservations,
    bookDiningTable,
    cancelDiningReservation,
    updateDiningReservationStatus,
    payDiningBill,
    getDiningVenueById,
    liveEvents: LIVE_EVENTS_DATA,
    eventTickets,
    bookEventTicket,
    cancelEventTicket,
    checkInEventTicket,
    getLiveEventById,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    token,
    userRole,
    userProfile,
    switchRole,
    handleRegister,
    handleLogin,
    handleLogout,
    loading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;