import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'error',
    },
  },
  decorators: [
    (Story, context) => (
      <div className='aia-min-side-ssr' lang={context.args.sprak ?? 'nb'}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
