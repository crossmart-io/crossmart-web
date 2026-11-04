import { MAX_IMAGE_BYTES } from '../catalog.constants';
import { imageFileProblem } from './image-file-check';

function fileOf(name: string, type: string, size = 1): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('imageFileProblem', () => {
  it('accepts the image types the API takes', () => {
    expect(imageFileProblem(fileOf('shirt.webp', 'image/webp'))).toBeNull();
  });

  it('names the file the API would refuse', () => {
    expect(imageFileProblem(fileOf('logo.svg', 'image/svg+xml'))).toMatch(/logo\.svg is not/);
    expect(imageFileProblem(fileOf('huge.png', 'image/png', MAX_IMAGE_BYTES + 1))).toMatch(
      /huge\.png is larger than 20 MB/,
    );
  });
});
