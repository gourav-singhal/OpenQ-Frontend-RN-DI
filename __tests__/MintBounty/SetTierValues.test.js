/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import nextRouter from 'next/router';
import SetTierValues from '../../components/MintBounty/SetTierValues';
import userEvent from '@testing-library/user-event';

describe('SetTier', () => {
  it('should display initial values for bar inputs', async () => {
    // ARRANGE
    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },

      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
    }));
    const mockSum = jest.fn();
    const mockEnabler = jest.fn();
    const mockSetFinalVolumes = jest.fn();
    render(
      <SetTierValues
        category={'Contest'}
        sum={9}
        setSum={mockSum}
        setEnableContest={mockEnabler}
        finalTierVolumes={['2', '3', '4']}
        tierArr={['0', '1', '2']}
        setFinalTierVolumes={mockSetFinalVolumes}
        initialVolumes={['2', '3', '4']}
      />
    );

    // ACT
    expect(await screen.findByText(/you still need to allocate: 91/i)).toBeInTheDocument();
    expect(screen.getByText('2%')).toBeInTheDocument();
    expect(screen.getByText('3%')).toBeInTheDocument();
    expect(screen.getByText('4%')).toBeInTheDocument();
    expect(screen.getByText('9%')).toBeInTheDocument();
  });

  it('should display initial values for bar inputs', async () => {
    // ARRANGE
    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },

      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
    }));
    const mockSum = jest.fn();
    const mockEnabler = jest.fn();
    const mockSetFinalVolumes = jest.fn();
    render(
      <SetTierValues
        category={'Fixed Contest'}
        sum={9}
        setSum={mockSum}
        setEnableContest={mockEnabler}
        finalTierVolumes={['2', '3', '4']}
        tierArr={['1', '2', '3']}
        setFinalTierVolumes={mockSetFinalVolumes}
        initialVolumes={['2', '3', '4']}
      />
    );

    // ACT
    expect(screen.getByPlaceholderText(/1st winner/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/2nd winner/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/3rd winner/i)).toBeInTheDocument();
  });
});
it('should give choice for bar inputs or number inputs', async () => {
  // ARRANGE
  nextRouter.useRouter = jest.fn();
  nextRouter.useRouter.mockImplementation(() => ({
    query: { type: null },

    prefetch: jest.fn(() => {
      return { catch: jest.fn };
    }),
  }));
  const mockSum = jest.fn();
  const mockEnabler = jest.fn();
  const mockSetFinalVolumes = jest.fn();
  const user = userEvent.setup();

  render(
    <SetTierValues
      category={'Contest'}
      sum={9}
      setSum={mockSum}
      setEnableContest={mockEnabler}
      finalTierVolumes={['2', '3', '4']}
      tierArr={['0', '1', '2']}
      setFinalTierVolumes={mockSetFinalVolumes}
      initialVolumes={['2', '3', '4']}
    />
  );

  // ACT
  expect(screen.getByText('2%')).toBeInTheDocument();
  expect(screen.getByText('3%')).toBeInTheDocument();
  expect(screen.getByText('4%')).toBeInTheDocument();
  expect(screen.getByText('9%')).toBeInTheDocument();
  const switchToText = screen.getByText(/text/i);
  await user.click(switchToText);

  expect(await screen.findByPlaceholderText(/1st winner/i)).toBeInTheDocument();
  expect(await screen.findByPlaceholderText(/2nd winner/i)).toBeInTheDocument();
  expect(await screen.findByPlaceholderText(/3rd winner/i)).toBeInTheDocument();
  expect(switchToText).toBeInTheDocument();
});
