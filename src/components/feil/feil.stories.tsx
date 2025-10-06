import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorBoundaryFeil } from "./error-boundary-feil";

const meta = {
  title: "Komponenter/Feilmelding",
  component: ErrorBoundaryFeil,
  args: {},
} satisfies Meta<typeof ErrorBoundaryFeil>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorBoundaryFeilKomponent: Story = {
  args: { error: new Error("test feil"), resetErrorBoundary: () => {} },
};
