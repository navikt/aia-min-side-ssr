import type { Meta, StoryObj } from '@storybook/react-vite';
import { aggregertePerioderMock } from '../../mock/data/aggregerte-perioder-mock.ts';
import AiA from './aia';

const meta = {
  title: 'AiA',
  component: AiA,
  decorators: [],
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  args: {},
} satisfies Meta<typeof AiA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Arbeidssøker: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: aggregertePerioderMock[0],
    tilgjengeligeBekreftelser: [],
  },
};

export const ArbeidssokerMedTilgjengeligBekreftelse: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: aggregertePerioderMock[0],
    tilgjengeligeBekreftelser: [
      {
        periodeId: '1',
        bekreftelseId: '2',
        gjelderFra: 'nå',
        gjelderTil: 'imorgen',
      },
    ] as any,
  },
};
export const AvsluttetPeriode: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: aggregertePerioderMock[1],
  },
};

export const IngenPerioder: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: null,
  },
};
