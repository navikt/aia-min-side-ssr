import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import AiA from './aia';
import { aktivPeriode, avsluttetPeriode, side2Url, tilgjengeligeBekreftelser } from './storybook-testdata';

const meta = {
  title: 'AiA',
  component: AiA,
  tags: ['autodocs'],
  args: {
    sprak: 'nb',
    aggregertPeriode: aktivPeriode,
    tilgjengeligeBekreftelser: [],
    side2Url,
  },
} satisfies Meta<typeof AiA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Arbeidssøker: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøker' })).toBeVisible();
    await expect(canvas.getByText('Se og endre opplysninger')).toBeVisible();
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
  },
};

export const ArbeidssokerMedTilgjengeligBekreftelse: Story = {
  args: { tilgjengeligeBekreftelser },
  play: async ({ canvas, userEvent }) => {
    const kort = canvas.getByRole('link', { name: /Du er registrert som arbeidssøker/ });
    const bekreftelse = canvas.getByRole('link', {
      name: /Bekreft at du vil være registrert som arbeidssøker hos Nav/,
    });
    await expect(bekreftelse).toBeVisible();
    await expect(bekreftelse).toHaveAttribute('href', `${side2Url}/bekreftelse`);
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
    kort.focus();
    await expect(kort).toHaveFocus();
    await userEvent.tab();
    await expect(bekreftelse).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(kort).toHaveFocus();
  },
};

export const AvsluttetPeriode: Story = {
  args: { aggregertPeriode: avsluttetPeriode, tilgjengeligeBekreftelser },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er ikke registrert som arbeidssøker' })).toBeVisible();
    await expect(canvas.getByText('Se tidligere opplysninger')).toBeVisible();
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    await expect(canvas.queryByRole('link', { name: /Bekreft at du vil være registrert/ })).not.toBeInTheDocument();
  },
};

export const IngenPerioder: Story = {
  args: { aggregertPeriode: null, tilgjengeligeBekreftelser },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
    await expect(canvasElement).toHaveTextContent('');
  },
};
