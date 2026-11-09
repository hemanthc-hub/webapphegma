import {
  fetchByPincode,
  fetchByPostOffice,
  detectCurrentLocation,
  saveLocation,
  getSavedLocation,
  clearLocation,
} from '../postOfficeService';

describe('postOfficeService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe('fetchByPincode', () => {
    it('returns error when pincode is invalid', async () => {
      const result = await fetchByPincode('123');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/valid 6-digit PIN code/i);

      const invalidLeadingZero = await fetchByPincode('012345');
      expect(invalidLeadingZero.success).toBe(false);

      const invalidLetters = await fetchByPincode('abcdef');
      expect(invalidLetters.success).toBe(false);
    });

    it('returns post offices on successful API response', async () => {
      const mockPostOffice = [
        {
          Name: 'Connaught Place',
          Pincode: '110001',
          District: 'New Delhi',
          State: 'Delhi',
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            Status: 'Success',
            Message: 'Number of pincode found:1',
            PostOffice: mockPostOffice,
          },
        ],
      });

      const result = await fetchByPincode('110001');
      expect(result.success).toBe(true);
      expect(result.postOffices).toHaveLength(1);
      expect(result.postOffices[0].Name).toBe('Connaught Place');
    });

    it('handles not found response from API', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            Status: 'Error',
            Message: 'No records found',
            PostOffice: null,
          },
        ],
      });

      const result = await fetchByPincode('999999');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/no post office found/i);
    });

    it('handles network failure gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network offline'));

      const result = await fetchByPincode('110001');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/unable to connect|failed to fetch/i);
    });
  });

  describe('fetchByPostOffice', () => {
    it('rejects queries shorter than 3 characters', async () => {
      const result = await fetchByPostOffice('ab');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/at least 3 characters/i);
    });

    it('fetches post offices by branch name', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            Status: 'Success',
            PostOffice: [
              {
                Name: 'Indiranagar',
                Pincode: '560038',
                District: 'Bangalore',
                State: 'Karnataka',
              },
            ],
          },
        ],
      });

      const result = await fetchByPostOffice('Indiranagar');
      expect(result.success).toBe(true);
      expect(result.postOffices[0].Name).toBe('Indiranagar');
    });

    it('handles empty results for branch search', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ Status: 'Error', PostOffice: [] }],
      });

      const result = await fetchByPostOffice('NonExistentBranch');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/no post office branch found/i);
    });
  });

  describe('Location Storage Management', () => {
    it('saves valid location to localStorage and retrieves it', () => {
      const sampleLocation = {
        pincode: '560001',
        name: 'Bangalore G.P.O.',
        district: 'Bangalore',
        state: 'Karnataka',
      };

      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

      saveLocation(sampleLocation);

      expect(localStorage.getItem('delivery_location')).toBe(
        JSON.stringify(sampleLocation)
      );
      expect(dispatchSpy).toHaveBeenCalled();

      const saved = getSavedLocation();
      expect(saved).toEqual(sampleLocation);
    });

    it('ignores invalid location data when saving', () => {
      saveLocation({ pincode: 'invalid' });
      expect(getSavedLocation()).toBeNull();
    });

    it('reads legacy saved pincode format (e.g. "560001 - Bangalore")', () => {
      localStorage.setItem('delivery_pincode', '560001 - Bangalore');
      const saved = getSavedLocation();
      expect(saved).not.toBeNull();
      expect(saved.pincode).toBe('560001');
      expect(saved.name).toBe('Bangalore');
    });

    it('clears saved location and notifies listeners', () => {
      const sampleLocation = {
        pincode: '560001',
        name: 'Bangalore G.P.O.',
        district: 'Bangalore',
        state: 'Karnataka',
      };

      saveLocation(sampleLocation);
      expect(getSavedLocation()).not.toBeNull();

      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
      clearLocation();

      expect(localStorage.getItem('delivery_location')).toBeNull();
      expect(localStorage.getItem('delivery_pincode')).toBeNull();
      expect(getSavedLocation()).toBeNull();
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('detectCurrentLocation', () => {
    it('returns error when geolocation is unavailable', async () => {
      const originalGeo = navigator.geolocation;
      delete navigator.geolocation;

      const result = await detectCurrentLocation();
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/not supported/i);

      navigator.geolocation = originalGeo;
    });

    it('handles permission denied from browser geolocation', async () => {
      navigator.geolocation = {
        getCurrentPosition: jest.fn((success, error) => {
          error({ code: 1, message: 'User denied Geolocation' });
        }),
      };

      const result = await detectCurrentLocation();
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/permission was denied/i);
    });

    it('successfully detects location via coordinates and pincode verification', async () => {
      navigator.geolocation = {
        getCurrentPosition: jest.fn((success) => {
          success({
            coords: {
              latitude: 12.9716,
              longitude: 77.5946,
            },
          });
        }),
      };

      // Mock BigDataCloud reverse geocode response
      global.fetch = jest
        .fn()
        // 1st call: BigDataCloud reverse geocode
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            countryCode: 'IN',
            postcode: '560001',
            city: 'Bengaluru',
          }),
        })
        // 2nd call: fetchByPincode verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              Status: 'Success',
              PostOffice: [
                {
                  Name: 'Bangalore G.P.O.',
                  Pincode: '560001',
                  District: 'Bangalore',
                  State: 'Karnataka',
                },
              ],
            },
          ],
        });

      const result = await detectCurrentLocation();
      expect(result.success).toBe(true);
      expect(result.pincode).toBe('560001');
      expect(result.city).toBe('Bengaluru');
    });
  });
});

