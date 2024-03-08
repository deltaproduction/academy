import path              from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const nextConfig = {
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  redirects: async () => ([
    {
      source: '/',
      destination: '/classes/',
      permanent: true
    }
  ]),
};

export default nextConfig;
