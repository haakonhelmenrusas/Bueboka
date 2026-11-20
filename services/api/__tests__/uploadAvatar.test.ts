import { uploadAvatar } from '../uploadAvatar';
import { authFetchClient } from '@/services/api/authFetch';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';

jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: { patch: jest.fn() },
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: { JPEG: 'jpeg', PNG: 'png', WEBP: 'webp' },
}));

jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation(() => ({
    arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
  })),
}));

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  rn.Image.getSize = jest.fn((_uri: string, success: (w: number, h: number) => void) => success(4000, 3000));
  return rn;
});

const mockPatch = authFetchClient.patch as jest.Mock;
const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock;

describe('uploadAvatar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockManipulate.mockResolvedValue({ uri: 'file:///tmp/compressed.jpg' });
    mockPatch.mockResolvedValue({ data: { id: 'u1' } });
  });

  it('resizes so the longest edge is 800px and uploads a jpeg data URI', async () => {
    await uploadAvatar('file:///tmp/photo.jpg');

    expect(mockManipulate).toHaveBeenCalledWith(
      'file:///tmp/photo.jpg',
      [{ resize: { width: 800, height: 600 } }],
      expect.objectContaining({ format: 'jpeg', compress: 0.7 }),
    );
    expect(mockPatch).toHaveBeenCalledWith('/users', {
      image: expect.stringMatching(/^data:image\/jpeg;base64,/),
    });
    // the compressed uri is what gets read, not the original photo
    const dataUri = mockPatch.mock.calls[0][1].image as string;
    expect(dataUri.length).toBeLessThan(1000); // tiny mocked buffer, not a real photo
  });

  it('does not upscale small images', async () => {
    (Image.getSize as unknown as jest.Mock).mockImplementationOnce((_u: string, success: (w: number, h: number) => void) =>
      success(400, 300),
    );

    await uploadAvatar('file:///tmp/small.jpg');

    expect(mockManipulate).toHaveBeenCalledWith('file:///tmp/small.jpg', [], expect.objectContaining({ format: 'jpeg' }));
  });
});
