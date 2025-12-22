import type { TilgjengeligeBekreftelser } from '@navikt/arbeidssokerregisteret-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AiA from './aia';
import { snapshotMock } from '../../mock/data/snapshot-mock.ts';

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
    aggregertPeriode: snapshotMock,
    tilgjengeligeBekreftelser: [],
    side2Url: 'http://localhost:3000/test',
  },
};

export const ArbeidssokerMedTilgjengeligBekreftelse: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: snapshotMock,
    tilgjengeligeBekreftelser: [
      {
        periodeId: '1',
        bekreftelseId: '2',
        gjelderFra: 'nå',
        gjelderTil: 'imorgen',
      },
    ] as unknown as TilgjengeligeBekreftelser[],
    side2Url: 'http://localhost:3000/test',
  },
};
export const AvsluttetPeriode: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: snapshotMock,
    side2Url: 'http://localhost:3000/test',
  },
};

export const IngenPerioder: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: null,
    side2Url: 'http://localhost:3000/test',
  },
};
