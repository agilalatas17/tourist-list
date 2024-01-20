import react from '@vitejs/plugin-react';
import ViteSassPlugin from 'vite-plugin-sass';

export default {
  plugins: [
    react(),
    ViteSassPlugin({
      include: /\.scss$/,
      exclude: /node_modules/,
    }),
  ],
};
