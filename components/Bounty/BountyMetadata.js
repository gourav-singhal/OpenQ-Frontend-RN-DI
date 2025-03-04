import React, { useContext, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LabelsList from './LabelsList';
import CopyBountyAddress from './CopyBountyAddress';
import StoreContext from '../../store/Store/StoreContext';
import TokenBalances from '../TokenBalances/TokenBalances';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import PieChart from './PieChart';

const BountyMetadata = ({ bounty, setInternalMenu, price, budget, split }) => {
  const [appState] = useContext(StoreContext);
  const createPayout = (bounty) => {
    return bounty.payoutTokenVolume
      ? {
          tokenAddress: bounty.payoutTokenAddress,
          volume: bounty.payoutTokenVolume,
        }
      : null;
  };
  const payoutBalances = useMemo(() => createPayout(bounty), [bounty]);
  const [payoutValues] = useGetTokenValues(payoutBalances);
  let type = 'Fixed Price';

  switch (bounty.bountyType) {
    case '0':
      type = 'Fixed Price';
      break;
    case '1':
      type = 'Split Price';
      break;
    case '2':
      type = 'Contest';
      break;
    case '3':
      type = 'Contest';
      break;
  }

  return (
    <ul className='md:max-w-[300px] w-full md:pl-4'>
      {bounty.bountyType && (
        <li className='border-b border-web-gray py-3'>
          <div className='text-xs font-semibold text-muted'>Type</div>
          <div className='text-xs font-semibold text-primary leading-loose'>{type}</div>
        </li>
      )}

      <li className='border-b border-web-gray py-3'>
        <div className='text-xs font-semibold text-muted'>🔒 TVL</div>
        <button className='text-xs font-semibold text-primary pt-2' onClick={() => setInternalMenu('Fund')}>
          {(price && appState.utils.formatter.format(price)) || '$0.00'}
        </button>
      </li>

      {bounty.fundingGoalVolume && (
        <li className='border-b border-web-gray py-3'>
          <div className='text-xs font-semibold text-muted'>🎯 Current Target Budget</div>
          <div className='text-xs font-semibold text-primary pt-2'>
            {(budget && appState.utils.formatter.format(budget)) || '$0.00'}
          </div>
        </li>
      )}

      {bounty.bountyType == 1 ? (
        <li className='border-b border-web-gray py-3'>
          {(split || split === 0) && (
            <>
              <div className='text-xs font-semibold text-muted'>Current Reward Split</div>
              <button className='text-xs font-semibold text-primary' onClick={() => setInternalMenu('Claim')}>
                <TokenBalances
                  lean={true}
                  tokenBalances={payoutBalances}
                  tokenValues={payoutValues}
                  singleCurrency={true}
                  small={true}
                />
              </button>
            </>
          )}
        </li>
      ) : bounty.bountyType == 2 ? (
        <>
          <li className='py-3'>
            <div className='text-xs font-semibold text-muted'>Current Payout Schedule</div>
            <div className='flex items-center gap-4 pt-2 text-primary'>
              <div className='text-xs font-semibold leading-loose'>Number of tiers: </div>
              <div className='text-xs font-semibold'>{bounty.payoutSchedule?.length}</div>
            </div>
            <div className='flex flex-col max-h-80 w-full overflow-y-auto overflow-x-hidden'>
              {bounty.payoutSchedule?.map((t, index) => {
                return (
                  <div key={index} className='flex items-center gap-4 text-primary'>
                    <div className='text-xs font-semibold leading-loose'>{`${appState.utils.handleSuffix(
                      index + 1
                    )} winner:`}</div>
                    <div className='text-xs font-semibold'>{t} %</div>
                  </div>
                );
              })}
            </div>
          </li>
          <PieChart payoutSchedule={bounty.payoutSchedule} />
        </>
      ) : null}
      <>
        {bounty.assignees?.length > 0 && (
          <li className='border-b border-web-gray py-3'>
            <div className='text-xs font-semibold text-muted'>Assignees</div>

            {bounty.assignees.map((assignee, index) => {
              return (
                <div key={index} className='flex gap-2 py-3'>
                  <Image className='rounded-lg inline-block py-4' height={24} width={24} src={assignee.avatarUrl} />
                  <div className='inline-block text-xs pt-1 font-semibold'>{assignee.name}</div>
                </div>
              );
            })}
          </li>
        )}

        {bounty.labels && (
          <li className='border-b border-web-gray py-3'>
            <div className='text-xs font-semibold text-muted pb-2'>Labels</div>
            {bounty.labels.length > 0 ? <LabelsList bounty={bounty} /> : <span className='text-sm'>No labels</span>}
          </li>
        )}
        <li className='border-b border-web-gray py-3 text sm'>
          <Link href={`https://polygonscan.com/address/${bounty.bountyAddress}`}>
            <div className='text-xs font-semibold  cursor-pointer text-muted'>Polygonscan</div>
          </Link>
          {bounty.bountyAddress && <CopyBountyAddress styles='text-sm pt-2' address={bounty.bountyAddress} />}
        </li>
        <li className='border-b border-web-gray py-3'>
          {bounty?.prs?.some((pr) => pr.source['__typename'] === 'PullRequest' && pr.source.url) > 0 ? (
            <ul>
              <div className='text-xs font-semibold text-muted'>Linked Pull Requests</div>
              {bounty.prs
                .filter((pr) => {
                  return pr.source['__typename'] === 'PullRequest' && pr.source.url;
                })
                .map((pr, index) => {
                  if (pr.source['__typename'] === 'PullRequest' && pr.source.url) {
                    return (
                      <li className='text-sm text-primary' key={index}>
                        <Link href={pr.source.url}>
                          <a target='_blank' className={'underline'}>
                            {pr.source.title}
                          </a>
                        </Link>
                        <span>{pr.source.merged ? ' (merged)' : ' (not merged)'}</span>
                      </li>
                    );
                  }
                })}
            </ul>
          ) : (
            <span className='text-xs font-semibold text-muted'>No linked pull requests</span>
          )}
        </li>
      </>
    </ul>
  );
};
export default BountyMetadata;
