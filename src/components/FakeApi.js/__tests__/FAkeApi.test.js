import {
  MainApi,
  recentlyView,
  testimonialApi,
} from '../FAkeApi';

describe('FakeApi / Mock Data', () => {
  it('contains products in MainApi with required properties', () => {
    expect(Array.isArray(MainApi)).toBe(true);
    expect(MainApi.length).toBeGreaterThan(0);

    MainApi.forEach((item) => {
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('newPrice');
      expect(item).toHaveProperty('oldPrice');
      expect(item).toHaveProperty('image');
    });
  });

  it('contains valid recently viewed items', () => {
    expect(Array.isArray(recentlyView)).toBe(true);
    expect(recentlyView.length).toBeGreaterThan(0);

    recentlyView.forEach((item) => {
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('newPrice');
    });
  });

  it('contains doctors and healthcare practitioner testimonials', () => {
    expect(Array.isArray(testimonialApi)).toBe(true);
    expect(testimonialApi.length).toBe(4);

    testimonialApi.forEach((testimonial) => {
      expect(testimonial).toHaveProperty('name');
      expect(testimonial).toHaveProperty('review');
      expect(testimonial).toHaveProperty('image');
      expect(testimonial.name.length).toBeGreaterThan(0);
      expect(testimonial.review.length).toBeGreaterThan(10);
    });
  });
});

