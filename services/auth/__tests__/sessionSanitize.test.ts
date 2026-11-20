import { stripDataUriImageFromSession } from '../sessionSanitize';

describe('stripDataUriImageFromSession', () => {
  it('nulls a data-URI user image so the session payload stays small', () => {
    const data = { user: { id: 'u1', name: 'Kari', image: `data:image/jpeg;base64,${'A'.repeat(500_000)}` } };
    stripDataUriImageFromSession(data);
    expect(data.user.image).toBeNull();
  });

  it('keeps external URL images untouched', () => {
    const data = { user: { id: 'u1', image: 'https://example.com/avatar.jpg' } };
    stripDataUriImageFromSession(data);
    expect(data.user.image).toBe('https://example.com/avatar.jpg');
  });

  it('tolerates missing user/data', () => {
    expect(() => stripDataUriImageFromSession(null)).not.toThrow();
    expect(() => stripDataUriImageFromSession({})).not.toThrow();
    expect(() => stripDataUriImageFromSession({ user: { image: null } })).not.toThrow();
  });
});
