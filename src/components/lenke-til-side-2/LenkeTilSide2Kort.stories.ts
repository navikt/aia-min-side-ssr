import type { Meta, StoryObj } from '@storybook/react-vite';
import LenkeTilSide2Kort from './LenkeTilSide2Kort';
import { snapshotMock } from '../../../mock/data/snapshot-mock.ts';

const meta = {
  title: 'Komponenter/LenkeTilSide2Kort',
  component: LenkeTilSide2Kort,
  decorators: [],
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof LenkeTilSide2Kort>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AktivArbeidssokerMedTilgjengeligBekreftelse: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: snapshotMock,
    harTilgjengeligBekreftelse: true,
    side2Url: 'http://localhost:3000/arbeidssoekerregisteret',
  },
};

export const AktivArbeidssoker: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: snapshotMock,
    harTilgjengeligBekreftelse: false,
    side2Url: 'http://localhost:3000/arbeidssoekerregisteret',
  },
};

export const IkkeAktivArbeidssoker: Story = {
  args: {
    sprak: 'nb',
    aggregertPeriode: snapshotMock,
    harTilgjengeligBekreftelse: false,
    side2Url: 'http://localhost:3000/arbeidssoekerregisteret',
  },
};
