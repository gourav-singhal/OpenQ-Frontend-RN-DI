/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ContractWizard from '../../components/ContractWizard/ContractWizard';
import userEvent from '@testing-library/user-event';

describe('ContractWizard', () => {
  it('should open wizard and direct to discord server', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    expect(await screen.findByText(/we didn't find a suitable contract/i)).toBeInTheDocument();
    expect(screen.getByRole('link').href).toBe('https://discord.gg/puQVqEvVXn');
  });

  it('should open wizard and direct to repating contract', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('Yes'));
    expect(screen.getByText(/Create a Contest Contract to send funds to any GitHub issue/i));
    expect(screen.getByText(/How many tiers/i));
  });

  it('should open wizard and direct to repating contract', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('Yes'));
    expect(screen.getByText(/Deploy split price contract/i));
    expect(screen.getByText(/Reward Split/i));
  });

  it('should open wizard and direct to atomic contract', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ContractWizard wizardVisibility={true} />);

    // ACT
    expect(screen.getByText(/Should only one person complete this task/i)).toBeInTheDocument();
    await user.click(screen.getByText('Yes'));
    expect(screen.getByText(/Create a Fixed Price Contract to send funds to any GitHub issue/i));
  });
});
