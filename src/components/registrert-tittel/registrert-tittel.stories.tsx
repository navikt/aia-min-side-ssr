import type { Meta, StoryObj } from '@storybook/react-vite';
import { snapshotMock } from '../../../mock/data/snapshot-mock.ts';
import RegistrertTittel from './registrert-tittel';

const meta = {
  title: 'Komponenter/RegistrertTittel',
  component: RegistrertTittel,
  args: {},
  tags: ['autodocs'],
} satisfies Meta<typeof RegistrertTittel>;

export default meta;
type Story = StoryObj<typeof RegistrertTittel>;

export const RegistreringsTittelAktivArbeidssokerStory: Story = {
  args: {
    sprak: 'nb',
    harAktivArbeidssokerperiode: true,
    opplysningerOmArbeidssoker: snapshotMock.opplysning,
  },
};

export const RegistreringsTittelIkkeAktivArbeidssokerStory: Story = {
  args: {
    sprak: 'nb',
    harAktivArbeidssokerperiode: false,
    opplysningerOmArbeidssoker: snapshotMock.opplysning,
  },
};
