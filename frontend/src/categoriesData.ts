import type { CategoryInfo, CategoryFamily } from './types';

export const CATEGORY_FAMILIES_DATA: Record<string, CategoryFamily> = {
  food_and_drink: {
    title: 'Food & Drink',
    icon: 'Utensils',
    description: 'Restaurants, cafes, bakeries, bars, and food services'
  },
  beauty_and_wellness: {
    title: 'Beauty & Wellness',
    icon: 'Sparkles',
    description: 'Hair, nails, spa, massage, and personal care services'
  },
  fitness_and_sports: {
    title: 'Fitness & Sports',
    icon: 'Dumbbell',
    description: 'Gyms, yoga studios, sports facilities, and martial arts'
  },
  pet_services: {
    title: 'Pet Services & Supplies',
    icon: 'Dog',
    description: 'Pet grooming, pet stores, veterinarians, and animal care'
  },
  entertainment: {
    title: 'Entertainment & Culture',
    icon: 'Film',
    description: 'Cinemas, theaters, bowling, arcades, and venues'
  },
  retail: {
    title: 'Retail & Shopping',
    icon: 'ShoppingBag',
    description: 'Supermarkets, clothing, electronics, and specialty stores'
  },
  services: {
    title: 'Professional & Personal Services',
    icon: 'Briefcase',
    description: 'Laundry, coworking, repair, dry cleaning, and printing'
  },
  healthcare: {
    title: 'Healthcare & Medical',
    icon: 'Stethoscope',
    description: 'Pharmacies, dental clinics, opticians, and medical centers'
  },
  education: {
    title: 'Education & Learning',
    icon: 'GraduationCap',
    description: 'Kindergartens, tutoring, language schools, and training'
  },
  automotive: {
    title: 'Automotive & Transport',
    icon: 'Car',
    description: 'Car wash, auto repair, parking, and rentals'
  },
  hospitality: {
    title: 'Hospitality & Lodging',
    icon: 'Hotel',
    description: 'Hotels, hostels, guest houses, and accommodation'
  }
};

export const MASTER_CATEGORIES_DATA: CategoryInfo[] = [
  // Food & Drink
  {
    id: 'bar_pub',
    title: 'Bar & Pub',
    family: 'food_and_drink',
    keywords: ['bar', 'pub', 'cocktail bar', 'lounge', 'craft beer'],
    overture_keys: ['bar', 'pub', 'cocktail_bar', 'wine_bar'],
    hierarchy_matchers: ['bar', 'pub', 'cocktail_bar']
  },
  {
    id: 'cafe',
    title: 'Cafe',
    family: 'food_and_drink',
    keywords: ['cafe', 'coffee shop', 'espresso', 'cafeteria'],
    overture_keys: ['cafe', 'coffee_shop', 'tea_house'],
    hierarchy_matchers: ['cafe', 'coffee_shop']
  },
  {
    id: 'coffee_shop',
    title: 'Specialty Coffee Shop',
    family: 'food_and_drink',
    keywords: ['coffee shop', 'specialty coffee', 'roastery', 'espresso bar'],
    overture_keys: ['coffee_shop', 'espresso_bar'],
    hierarchy_matchers: ['coffee_shop']
  },
  {
    id: 'restaurant',
    title: 'Restaurant',
    family: 'food_and_drink',
    keywords: ['restaurant', 'dining', 'eatery', 'bistro'],
    overture_keys: ['restaurant', 'casual_eatery', 'dining_establishment'],
    hierarchy_matchers: ['restaurant', 'dining_establishment']
  },
  {
    id: 'pizza_restaurant',
    title: 'Pizza Restaurant',
    family: 'food_and_drink',
    keywords: ['pizza', 'pizzeria', 'italian pizza'],
    overture_keys: ['pizza_restaurant', 'pizzeria'],
    hierarchy_matchers: ['pizza_restaurant']
  },
  {
    id: 'sushi_restaurant',
    title: 'Sushi & Japanese Restaurant',
    family: 'food_and_drink',
    keywords: ['sushi', 'japanese restaurant', 'ramen'],
    overture_keys: ['sushi_restaurant', 'japanese_restaurant'],
    hierarchy_matchers: ['sushi_restaurant']
  },
  {
    id: 'steakhouse',
    title: 'Steakhouse & Grill',
    family: 'food_and_drink',
    keywords: ['steakhouse', 'grill', 'bbq', 'barbecue'],
    overture_keys: ['steakhouse', 'barbecue_restaurant'],
    hierarchy_matchers: ['steakhouse']
  },
  {
    id: 'fast_food',
    title: 'Fast Food',
    family: 'food_and_drink',
    keywords: ['fast food', 'burger', 'takeout', 'quick service'],
    overture_keys: ['fast_food_restaurant', 'quick_service_restaurant'],
    hierarchy_matchers: ['fast_food_restaurant']
  },
  {
    id: 'bakery',
    title: 'Bakery & Pastry Shop',
    family: 'food_and_drink',
    keywords: ['bakery', 'pastry', 'bread', 'patisserie'],
    overture_keys: ['bakery', 'pastry_shop'],
    hierarchy_matchers: ['bakery', 'pastry_shop']
  },
  {
    id: 'wine_bar',
    title: 'Wine Bar',
    family: 'food_and_drink',
    keywords: ['wine bar', 'winery', 'tasting room'],
    overture_keys: ['wine_bar'],
    hierarchy_matchers: ['wine_bar']
  },

  // Beauty & Wellness
  {
    id: 'hair_salon',
    title: 'Hair Salon',
    family: 'beauty_and_wellness',
    keywords: ['hair salon', 'hairdresser', 'hair stylist'],
    overture_keys: ['hair_salon', 'hairdresser', 'beauty_salon'],
    hierarchy_matchers: ['hair_salon', 'hairdresser']
  },
  {
    id: 'barber',
    title: 'Barbershop',
    family: 'beauty_and_wellness',
    keywords: ['barber', 'barbershop', 'men hair'],
    overture_keys: ['barber_shop', 'barber'],
    hierarchy_matchers: ['barber_shop', 'barber']
  },
  {
    id: 'nail_salon',
    title: 'Nail Salon',
    family: 'beauty_and_wellness',
    keywords: ['nail salon', 'manicure', 'pedicure'],
    overture_keys: ['nail_salon', 'manicure_and_pedicure'],
    hierarchy_matchers: ['nail_salon']
  },
  {
    id: 'beauty_salon',
    title: 'Beauty & Aesthetics Salon',
    family: 'beauty_and_wellness',
    keywords: ['beauty salon', 'cosmetics', 'facial', 'skin care'],
    overture_keys: ['beauty_salon', 'facial_spa'],
    hierarchy_matchers: ['beauty_salon']
  },
  {
    id: 'spa_massage',
    title: 'Spa & Massage Center',
    family: 'beauty_and_wellness',
    keywords: ['spa', 'massage', 'wellness center', 'day spa'],
    overture_keys: ['day_spa', 'massage_spa', 'spa'],
    hierarchy_matchers: ['day_spa', 'massage_spa', 'spa']
  },
  {
    id: 'tattoo_parlor',
    title: 'Tattoo & Piercing Studio',
    family: 'beauty_and_wellness',
    keywords: ['tattoo', 'piercing', 'body art'],
    overture_keys: ['tattoo_parlor'],
    hierarchy_matchers: ['tattoo_parlor']
  },

  // Fitness & Sports
  {
    id: 'gym',
    title: 'Gym & Fitness Center',
    family: 'fitness_and_sports',
    keywords: ['gym', 'fitness center', 'workout', 'health club'],
    overture_keys: ['gym', 'fitness_center'],
    hierarchy_matchers: ['gym', 'fitness_center']
  },
  {
    id: 'yoga_pilates',
    title: 'Yoga & Pilates Studio',
    family: 'fitness_and_sports',
    keywords: ['yoga', 'pilates', 'yoga studio'],
    overture_keys: ['yoga_studio', 'pilates_studio'],
    hierarchy_matchers: ['yoga_studio', 'pilates_studio']
  },
  {
    id: 'swimming_pool',
    title: 'Swimming Pool & Aquatic Center',
    family: 'fitness_and_sports',
    keywords: ['swimming pool', 'aquatic center', 'public pool'],
    overture_keys: ['swimming_pool', 'public_swimming_pool'],
    hierarchy_matchers: ['swimming_pool']
  },
  {
    id: 'crossfit',
    title: 'CrossFit Box & Functional Training',
    family: 'fitness_and_sports',
    keywords: ['crossfit', 'functional training', 'hiit'],
    overture_keys: ['crossfit_gym', 'fitness_center'],
    hierarchy_matchers: ['fitness_center']
  },
  {
    id: 'martial_arts',
    title: 'Martial Arts & Boxing Academy',
    family: 'fitness_and_sports',
    keywords: ['martial arts', 'karate', 'judo', 'boxing', 'mma'],
    overture_keys: ['martial_arts_school'],
    hierarchy_matchers: ['martial_arts_school']
  },

  // Pet Services
  {
    id: 'pet_grooming',
    title: 'Pet Grooming Salon',
    family: 'pet_services',
    keywords: ['pet grooming', 'dog grooming', 'cat grooming', 'pet wash'],
    overture_keys: ['pet_grooming_service', 'pet_grooming', 'pet_services'],
    hierarchy_matchers: ['pet_grooming', 'pet_grooming_service']
  },
  {
    id: 'pet_store',
    title: 'Pet Store & Supplies',
    family: 'pet_services',
    keywords: ['pet store', 'pet shop', 'pet supplies'],
    overture_keys: ['pet_store', 'pet_supply_store'],
    hierarchy_matchers: ['pet_store']
  },
  {
    id: 'veterinarian',
    title: 'Veterinary Clinic & Hospital',
    family: 'pet_services',
    keywords: ['vet', 'veterinarian', 'animal hospital', 'pet clinic'],
    overture_keys: ['veterinarian', 'veterinary_care'],
    hierarchy_matchers: ['veterinarian']
  },
  {
    id: 'dog_daycare',
    title: 'Dog Daycare & Pet Hotel',
    family: 'pet_services',
    keywords: ['dog daycare', 'pet hotel', 'pet boarding', 'kennel'],
    overture_keys: ['pet_boarding_service', 'dog_daycare'],
    hierarchy_matchers: ['pet_boarding_service']
  },

  // Entertainment & Culture
  {
    id: 'cinema',
    title: 'Cinema & Movie Theater',
    family: 'entertainment',
    keywords: ['cinema', 'movie theater', 'pictures'],
    overture_keys: ['movie_theater', 'cinema'],
    hierarchy_matchers: ['movie_theater', 'cinema']
  },
  {
    id: 'bowling',
    title: 'Bowling Alley',
    family: 'entertainment',
    keywords: ['bowling', 'bowling alley', 'tenpin'],
    overture_keys: ['bowling_alley'],
    hierarchy_matchers: ['bowling_alley']
  },
  {
    id: 'arcade_gaming',
    title: 'Arcade & Escape Room',
    family: 'entertainment',
    keywords: ['arcade', 'escape room', 'gaming center', 'vr gaming'],
    overture_keys: ['amusement_center', 'escape_room', 'video_arcade'],
    hierarchy_matchers: ['escape_room', 'video_arcade']
  },
  {
    id: 'theater',
    title: 'Theater & Performing Arts',
    family: 'entertainment',
    keywords: ['theater', 'performing arts', 'playhouse'],
    overture_keys: ['performing_arts_theater'],
    hierarchy_matchers: ['performing_arts_theater']
  },
  {
    id: 'museum_gallery',
    title: 'Museum & Art Gallery',
    family: 'entertainment',
    keywords: ['museum', 'art gallery', 'exhibition'],
    overture_keys: ['museum', 'art_gallery'],
    hierarchy_matchers: ['museum', 'art_gallery']
  },
  {
    id: 'nightclub',
    title: 'Nightclub & Live Music Venue',
    family: 'entertainment',
    keywords: ['nightclub', 'disco', 'dance club', 'live music'],
    overture_keys: ['night_club', 'dance_club'],
    hierarchy_matchers: ['night_club']
  },

  // Services
  {
    id: 'laundry',
    title: 'Self-Service Laundry & Laundromat',
    family: 'services',
    keywords: ['laundry', 'laundromat', 'self-service laundry'],
    overture_keys: ['laundry_service', 'laundromat'],
    hierarchy_matchers: ['laundromat', 'laundry_service']
  },
  {
    id: 'dry_cleaning',
    title: 'Dry Cleaning',
    family: 'services',
    keywords: ['dry cleaning', 'dry cleaner'],
    overture_keys: ['dry_cleaning_service', 'dry_cleaners'],
    hierarchy_matchers: ['dry_cleaners']
  },
  {
    id: 'coworking',
    title: 'Coworking Space & Shared Office',
    family: 'services',
    keywords: ['coworking', 'shared office', 'flex workspace'],
    overture_keys: ['coworking_space', 'shared_office_space'],
    hierarchy_matchers: ['coworking_space']
  },
  {
    id: 'repair_shop',
    title: 'Electronics & Phone Repair',
    family: 'services',
    keywords: ['phone repair', 'electronics repair', 'computer repair'],
    overture_keys: ['mobile_phone_repair_shop', 'electronics_repair_shop'],
    hierarchy_matchers: ['electronics_repair_shop']
  },
  {
    id: 'printing',
    title: 'Printing & Signage Studio',
    family: 'services',
    keywords: ['printing', 'copyshop', 'signage', 'print shop'],
    overture_keys: ['print_shop', 'copy_shop'],
    hierarchy_matchers: ['print_shop']
  },

  // Healthcare
  {
    id: 'pharmacy',
    title: 'Pharmacy & Chemist',
    family: 'healthcare',
    keywords: ['pharmacy', 'chemist', 'drugstore'],
    overture_keys: ['pharmacy', 'drugstore'],
    hierarchy_matchers: ['pharmacy']
  },
  {
    id: 'dentist',
    title: 'Dental Clinic',
    family: 'healthcare',
    keywords: ['dentist', 'dental clinic'],
    overture_keys: ['dentist', 'dental_clinic'],
    hierarchy_matchers: ['dentist']
  },
  {
    id: 'optician',
    title: 'Optician & Eyewear Store',
    family: 'healthcare',
    keywords: ['optician', 'eyewear', 'optometrist', 'glasses'],
    overture_keys: ['optician', 'optometrist', 'eyewear_store'],
    hierarchy_matchers: ['optician']
  },
  {
    id: 'medical_clinic',
    title: 'Medical Clinic & Health Center',
    family: 'healthcare',
    keywords: ['medical clinic', 'health center', 'doctor office'],
    overture_keys: ['medical_clinic', 'health_center'],
    hierarchy_matchers: ['medical_clinic']
  },

  // Education
  {
    id: 'kindergarten',
    title: 'Kindergarten & Preschool',
    family: 'education',
    keywords: ['kindergarten', 'preschool', 'daycare', 'nursery'],
    overture_keys: ['preschool', 'kindergarten', 'child_care_service'],
    hierarchy_matchers: ['kindergarten', 'preschool']
  },
  {
    id: 'language_school',
    title: 'Language School & Tutoring',
    family: 'education',
    keywords: ['language school', 'english school', 'tutoring'],
    overture_keys: ['language_school', 'tutoring_service'],
    hierarchy_matchers: ['language_school']
  },
  {
    id: 'driving_school',
    title: 'Driving School',
    family: 'education',
    keywords: ['driving school', 'driver training'],
    overture_keys: ['driving_school'],
    hierarchy_matchers: ['driving_school']
  },

  // Automotive
  {
    id: 'car_wash',
    title: 'Car Wash & Detailing',
    family: 'automotive',
    keywords: ['car wash', 'auto detailing'],
    overture_keys: ['car_wash', 'auto_detailing_service'],
    hierarchy_matchers: ['car_wash']
  },
  {
    id: 'car_repair',
    title: 'Auto Repair & Mechanic',
    family: 'automotive',
    keywords: ['car repair', 'mechanic', 'auto service'],
    overture_keys: ['automotive_repair', 'auto_repair_shop'],
    hierarchy_matchers: ['automotive_repair']
  },
  {
    id: 'tire_shop',
    title: 'Tire Shop & Service',
    family: 'automotive',
    keywords: ['tire shop', 'tires', 'wheel alignment'],
    overture_keys: ['tire_shop'],
    hierarchy_matchers: ['tire_shop']
  },

  // Hospitality
  {
    id: 'hotel',
    title: 'Hotel & Resort',
    family: 'hospitality',
    keywords: ['hotel', 'resort', 'lodging'],
    overture_keys: ['hotel', 'resort'],
    hierarchy_matchers: ['hotel']
  },
  {
    id: 'hostel',
    title: 'Hostel & Backpackers',
    family: 'hospitality',
    keywords: ['hostel', 'youth hostel', 'backpackers'],
    overture_keys: ['hostel'],
    hierarchy_matchers: ['hostel']
  },
  {
    id: 'guest_house',
    title: 'Guest House & Bed and Breakfast',
    family: 'hospitality',
    keywords: ['guest house', 'bed and breakfast', 'b&b'],
    overture_keys: ['guest_house', 'bed_and_breakfast'],
    hierarchy_matchers: ['guest_house']
  },

  // Retail
  {
    id: 'supermarket',
    title: 'Supermarket & Grocery',
    family: 'retail',
    keywords: ['supermarket', 'grocery store'],
    overture_keys: ['supermarket', 'grocery_store'],
    hierarchy_matchers: ['supermarket']
  },
  {
    id: 'convenience_store',
    title: 'Convenience Store (24/7)',
    family: 'retail',
    keywords: ['convenience store', 'minimarket', 'corner shop'],
    overture_keys: ['convenience_store'],
    hierarchy_matchers: ['convenience_store']
  },
  {
    id: 'clothing_store',
    title: 'Clothing & Fashion Store',
    family: 'retail',
    keywords: ['clothing store', 'boutique', 'fashion'],
    overture_keys: ['clothing_store', 'boutique'],
    hierarchy_matchers: ['clothing_store']
  },
  {
    id: 'electronics_store',
    title: 'Electronics & Gadgets Store',
    family: 'retail',
    keywords: ['electronics', 'gadgets', 'appliances', 'tech store'],
    overture_keys: ['electronics_store', 'appliance_store'],
    hierarchy_matchers: ['electronics_store']
  },
  {
    id: 'bookstore',
    title: 'Bookstore & Stationer',
    family: 'retail',
    keywords: ['bookstore', 'books', 'stationery'],
    overture_keys: ['book_store'],
    hierarchy_matchers: ['book_store']
  },
  {
    id: 'furniture_store',
    title: 'Furniture & Home Decor Store',
    family: 'retail',
    keywords: ['furniture', 'home decor', 'interior'],
    overture_keys: ['furniture_store', 'home_goods_store'],
    hierarchy_matchers: ['furniture_store']
  },
  {
    id: 'jewelry_store',
    title: 'Jewelry & Watch Store',
    family: 'retail',
    keywords: ['jewelry', 'watches', 'goldsmith'],
    overture_keys: ['jewelry_store'],
    hierarchy_matchers: ['jewelry_store']
  }
];
