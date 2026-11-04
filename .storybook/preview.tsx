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

    // addon-a11y reports full axe results, including `incomplete`, through Storybook's
    // reporting API; addon-vitest retains them in each story's test reports.
    a11y: {
      test: 'error',
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
        },
      },
    },
  },
  beforeEach: ({ canvasElement }) => {
    const document = canvasElement.ownerDocument;
    const root = document.documentElement;
    const rootStyleBefore = root.style.cssText;
    const canvasStyleBefore = canvasElement.style.cssText;
    const elementStylesBefore = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('*'),
      (element) => [element, element.style.cssText] as const,
    );

    return () => {
      root.style.cssText = rootStyleBefore;
      canvasElement.style.cssText = canvasStyleBefore;
      for (const [element, style] of elementStylesBefore) element.style.cssText = style;
    };
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
