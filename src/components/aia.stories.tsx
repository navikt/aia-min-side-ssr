import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import AiA from './aia';
import {
  aktivPeriode,
  avsluttetPeriode,
  permittertPeriode,
  side2Url,
  tilgjengeligeBekreftelser,
} from './storybook-testdata';
import { kontrollerTastaturOgTeksttilpasning } from './uu-testhjelpere';

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
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøker' })).toBeVisible();
    await expect(canvas.getByText('Se og endre opplysninger')).toBeVisible();
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^Du er registrert som arbeidssøker/]);
  },
};

export const ArbeidssokerMedTilgjengeligBekreftelse: Story = {
  args: { tilgjengeligeBekreftelser },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const kort = canvas.getByRole('link', { name: /Du er registrert som arbeidssøker/ });
    const bekreftelse = canvas.getByRole('link', {
      name: 'Bekreft at du vil være registrert som arbeidssøker hos Nav',
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
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [
      /^Du er registrert som arbeidssøker/,
      'Bekreft at du vil være registrert som arbeidssøker hos Nav',
    ]);
  },
};

export const AvsluttetPeriode: Story = {
  args: { aggregertPeriode: avsluttetPeriode, tilgjengeligeBekreftelser },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er ikke registrert som arbeidssøker' })).toBeVisible();
    await expect(canvas.getByText('Se tidligere opplysninger')).toBeVisible();
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
    await expect(canvas.queryByRole('link', { name: /Bekreft at du vil være registrert/ })).not.toBeInTheDocument();
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^Du er ikke registrert som arbeidssøker/]);
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

export const Nynorsk: Story = {
  args: { sprak: 'nn' },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som arbeidssøkjar' })).toBeVisible();
    await expect(canvas.getByText('Sjå og endre opplysningar')).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `${side2Url}/nn`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^Du er registrert som arbeidssøkjar/]);
  },
};

export const English: Story = {
  args: { sprak: 'en' },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'You are registered as job seeker' })).toBeVisible();
    await expect(canvas.getByText('View and change answers from registration')).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', `${side2Url}/en`);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [/^You are registered as job seeker/]);
  },
};

export const Permittert: Story = {
  args: { aggregertPeriode: permittertPeriode },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Du er registrert som permittert arbeidssøker' })).toBeVisible();
    await expect(canvas.getByRole('link')).toHaveAttribute('href', side2Url);
    await kontrollerTastaturOgTeksttilpasning(canvasElement, userEvent, [
      /^Du er registrert som permittert arbeidssøker/,
    ]);
  },
};

export const IngenPerioderNynorsk: Story = {
  args: { sprak: 'nn', aggregertPeriode: null },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
    await expect(canvasElement).toHaveTextContent('');
  },
};

export const IngenPerioderEngelsk: Story = {
  args: { sprak: 'en', aggregertPeriode: null },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
    await expect(canvasElement).toHaveTextContent('');
  },
};
