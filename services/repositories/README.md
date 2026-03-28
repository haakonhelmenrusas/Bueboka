# Repository Layer Documentation

## Overview

The repository layer provides a clean abstraction over API calls, handling all data access logic for the Bueboka app. Each repository corresponds to a backend entity and provides type-safe methods for CRUD operations.

## Available Repositories

### 1. User Repository

**Import:**

```typescript
import { userRepository } from '@/services/repositories';
```

**Methods:**

- `getCurrentUser()` - Get current user profile
- `updateProfile(data)` - Update user profile (name, club)
- `updateAvatar(imageUri)` - Upload and update user avatar
- `deleteAccount()` - Delete user account

**Example:**

```typescript
// Get current user
const user = await userRepository.getCurrentUser();

// Update profile
const updatedUser = await userRepository.updateProfile({
  name: 'New Name',
  club: 'My Archery Club',
});
```

---

### 2. Bow Repository

**Import:**

```typescript
import { bowRepository } from '@/services/repositories';
```

**Methods:**

- `getAll()` - Get all bows for current user
- `getById(id)` - Get specific bow
- `create(data)` - Create new bow
- `update(id, data)` - Update existing bow
- `delete(id)` - Delete bow
- `toggleFavorite(id, isFavorite)` - Toggle favorite status

**Example:**

```typescript
import { BowType } from '@/types';

// Get all bows
const bows = await bowRepository.getAll();

// Create new bow
const newBow = await bowRepository.create({
  name: 'My Competition Bow',
  type: BowType.RECURVE,
  eyeToNock: 80,
  aimMeasure: 85,
  notes: 'Competition setup',
  isFavorite: true,
});

// Update bow
const updated = await bowRepository.update(newBow.id, {
  name: 'Updated Name',
});

// Delete bow
await bowRepository.delete(bowId);
```

---

### 3. Arrows Repository

**Import:**

```typescript
import { arrowsRepository } from '@/services/repositories';
```

**Methods:**

- `getAll()` - Get all arrow sets
- `getById(id)` - Get specific arrow set
- `create(data)` - Create new arrow set
- `update(id, data)` - Update arrow set
- `delete(id)` - Delete arrow set
- `toggleFavorite(id, isFavorite)` - Toggle favorite status

**Example:**

```typescript
import { Material } from '@/types';

// Create arrow set
const arrows = await arrowsRepository.create({
  name: 'Carbon Pro X23',
  material: Material.KARBON,
  arrowsCount: 12,
  diameter: 5.2,
  weight: 400,
  length: 31,
  spine: '500',
  pointType: 'Bullet',
  pointWeight: 100,
  vanes: 'Bohning X Vanes',
  nock: 'Easton G Nock',
  isFavorite: true,
});

// Get all arrows
const allArrows = await arrowsRepository.getAll();
```

---

### 4. Practice Repository

**Import:**

```typescript
import { practiceRepository } from '@/services/repositories';
```

**Methods:**

- `getAll(params?)` - Get all practices with optional pagination/filters
- `getById(id)` - Get specific practice with ends
- `create(data)` - Create new practice session
- `update(id, data)` - Update practice
- `delete(id)` - Delete practice
- `addEnd(practiceId, data)` - Add end to practice
- `updateEnd(practiceId, endId, data)` - Update specific end
- `deleteEnd(practiceId, endId)` - Delete specific end
- `getByDateRange(startDate, endDate)` - Get practices in date range

**Example:**

```typescript
import { Environment, WeatherCondition } from '@/types';

// Create practice with ends
const practice = await practiceRepository.create({
  date: new Date(),
  environment: Environment.INDOOR,
  weather: [WeatherCondition.CLEAR],
  location: 'Oslo Archery Hall',
  bowId: 'bow-id-here',
  arrowsId: 'arrows-id-here',
  notes: 'Good practice session',
  ends: [
    {
      arrows: 6,
      scores: [10, 10, 9, 9, 8, 7],
      distanceMeters: 18,
      targetSizeCm: 40,
      arrowsPerEnd: 6,
    },
  ],
});

// Get paginated practices
const { data, total, page } = await practiceRepository.getAll({
  page: 1,
  limit: 20,
  startDate: new Date('2024-01-01'),
  endDate: new Date(),
});

// Add another end to practice
const newEnd = await practiceRepository.addEnd(practice.id, {
  arrows: 6,
  scores: [10, 9, 9, 8, 8, 7],
  distanceMeters: 18,
  targetSizeCm: 40,
});
```

---

### 5. Round Type Repository

**Import:**

```typescript
import { roundTypeRepository } from '@/services/repositories';
```

**Methods:**

- `getAll()` - Get all available round types
- `getById(id)` - Get specific round type

**Example:**

```typescript
// Get all round types
const roundTypes = await roundTypeRepository.getAll();

// Get specific round type
const roundType = await roundTypeRepository.getById('round-type-id');
```

---

## Error Handling

All repository methods throw `AppError` instances when operations fail. Always use try-catch:

```typescript
import { AppError } from '@/services';

try {
  const bows = await bowRepository.getAll();
} catch (error) {
  if (error instanceof AppError) {
    console.error(error.code); // e.g., 'UNAUTHORIZED', 'NETWORK_ERROR'
    console.error(error.message); // User-friendly message
  }
}
```

Common error codes:

- `UNAUTHORIZED` - Session expired, need to login
- `BAD_REQUEST` - Invalid data sent to API
- `NOT_FOUND` - Resource not found
- `NETWORK_ERROR` - Network connection issues
- `TIMEOUT` - Request timed out
- `SERVER_ERROR` - Backend server error

---

## Usage in Components

### Example: Loading Bows in Profile Screen

```typescript
import { useEffect, useState } from 'react';
import { bowRepository } from '@/services/repositories';
import { Bow } from '@/types';
import { AppError } from '@/services';

function ProfileScreen() {
  const [bows, setBows] = useState<Bow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBows();
  }, []);

  async function loadBows() {
    try {
      setLoading(true);
      setError(null);
      const data = await bowRepository.getAll();
      setBows(data);
    } catch (err) {
      if (err instanceof AppError) {
        setError(err.message);
      } else {
        setError('Failed to load bows');
      }
    } finally {
      setLoading(false);
    }
  }

  // Component render...
}
```

---

## Best Practices

1. **Always handle errors** - Use try-catch blocks
2. **Show loading states** - Set loading flags while fetching
3. **Provide user feedback** - Display error messages to users
4. **Use TypeScript types** - Leverage the type safety provided
5. **Avoid direct API calls** - Always use repositories
6. **Cache when appropriate** - Store frequently used data in state/context

---

## Migration from AsyncStorage

When migrating components from AsyncStorage:

**Before:**

```typescript
import { getLocalStorage, storeLocalStorage } from '@/utils';

const bows = (await getLocalStorage<Bow[]>('bows')) || [];
await storeLocalStorage('bows', [...bows, newBow]);
```

**After:**

```typescript
import { bowRepository } from '@/services/repositories';

const bows = await bowRepository.getAll();
const newBow = await bowRepository.create(bowData);
```

Benefits:

- ✅ Data synced across devices
- ✅ No manual ID generation
- ✅ Automatic timestamps
- ✅ Server-side validation
- ✅ Relationship management
- ✅ User authentication
