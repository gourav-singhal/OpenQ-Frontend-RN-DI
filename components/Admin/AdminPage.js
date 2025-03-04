// Third party Libraries
import React, { useState, useContext, useEffect, useMemo } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';
import TokenFundBox from '../FundBounty/SearchTokens/TokenFundBox';
import AdminModal from './AdminModal.js';
import ToolTipNew from '../Utils/ToolTipNew';
import SetTierValues from '../MintBounty/SetTierValues';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import ClaimText from './ClaimText';

const AdminPage = ({ bounty, refreshBounty }) => {
  // Context
  const { library, account } = useWeb3();
  const [appState] = useContext(StoreContext);
  const { utils, openQClient, logger } = appState;
  let category = '';

  switch (bounty.bountyType) {
    case '0':
      break;
    case '1':
      category = 'Split Price';
      break;
    case '2':
      category = 'Contest';
      break;
    case '3':
      category = 'Fixed Contest';
  }

  const zeroAddressMetadata = {
    name: 'Matic',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'MATIC',
    decimals: 18,
    chainId: 80001,
    path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
  };

  // State
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [modal, setModal] = useState();
  const [error, setError] = useState('');
  const [showButton, setShowButton] = useState(
    ethers.utils.getAddress(bounty.issuer.id) == account && bounty.status == '0'
  );

  // funding goal volume and token
  const [volume, setVolume] = useState('');
  const [token, setToken] = useState(zeroAddressMetadata);

  // payout volume and token
  const [payoutVolume, setPayoutVolume] = useState('');
  const [payoutToken, setPayoutToken] = useState(zeroAddressMetadata);

  // contest state
  const initialTierArr = useMemo(() => {
    if (bounty.payoutSchedule) {
      return bounty.payoutSchedule.map((elem, index) => {
        return index.toString();
      });
    } else return [];
  }, [bounty]);
  const [tier, setTier] = useState(bounty.payoutSchedule?.length);
  const [tierArr, setTierArr] = useState(initialTierArr);
  const [finalTierVolumes, setFinalTierVolumes] = useState(bounty.payoutSchedule || []);

  const [sum, setSum] = useState(0);
  const [enableContest, setEnableContest] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const tierConditions = sum == 100;

  // handle change in Funding Goal

  function onCurrencySelect(token) {
    setToken({
      ...token,
      address: ethers.utils.getAddress(token.address),
    });
  }

  function onVolumeChange(volume) {
    utils.updateVolume(volume, setVolume);
  }

  // handle change in Payout for Ongoing Contracts

  function onPayoutTokenSelect(payoutToken) {
    setPayoutToken({
      ...payoutToken,
      address: ethers.utils.getAddress(payoutToken.address),
    });
  }

  function onPayoutVolumeChange(payoutVolume) {
    utils.updateVolume(payoutVolume, setPayoutVolume);
  }

  // handle change in Payout for Contests

  function onTierChange(e) {
    const newTier = e.target.value;
    if (newTier >= 0) {
      setTier(parseInt(e.target.value));
    }
    if (newTier > 100) {
      setTier('0');
    }
    const newTierArr = Array.from(
      {
        length: e.target.value,
      },
      (_, i) => i
    );
    setTierArr(newTierArr);

    // removes final tier volumes
    const newFinalTierVolumes = newTierArr.map((tier) => {
      return finalTierVolumes[tier];
    });
    setFinalTierVolumes(newFinalTierVolumes);
  }

  // useEffect

  useEffect(() => {
    if (!tierConditions) {
      setEnableContest(false);
    } else {
      setEnableContest(true);
    }
  }, [tier, sum]);

  // trigger smart contracts

  async function setBudget() {
    try {
      setIsLoading(true);
      const transaction = await openQClient.setFundingGoal(library, bounty.bountyId, token, volume);
      refreshBounty();
      setVolume('');
      setModal({
        transaction,
        type: 'Budget',
      });
    } catch (error) {
      logger.error(error, account, bounty.id);
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });
      setError({
        message,
        title,
      });
    }
  }

  async function setPayout() {
    try {
      setIsLoading(true);
      const transaction = await openQClient.setPayout(library, bounty.bountyId, payoutToken, payoutVolume);
      refreshBounty();
      setPayoutVolume('');
      setModal({
        transaction,
        type: 'Payout',
      });
    } catch (error) {
      logger.error(error, account, bounty.id);
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });
      setError({
        message,
        title,
      });
    }
  }
  async function setPayoutSchedule() {
    try {
      setIsLoading(true);
      const transaction = await openQClient.setPayoutSchedule(library, bounty.bountyId, finalTierVolumes);
      refreshBounty();
      setModal({
        transaction,
        type: 'PayoutSchedule',
        finalTierVolume: finalTierVolumes,
      });
    } catch (error) {
      logger.error(error, account, bounty.id);
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });
      setError({
        message,
        title,
      });
    }
  }

  async function closeCompetition() {
    try {
      setIsLoading(true);
      const transaction = await openQClient.closeCompetition(library, bounty.bountyId);
      setModal({
        transaction,
        type: 'Closed Contest',
      });
      setShowButton(false);
      refreshBounty();
      //	dispatch(payload);
    } catch (error) {
      logger.error(error, account, bounty.id);
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });
      setError({
        message,
        title,
      });
    }
  }

  async function closeOngoing() {
    try {
      setIsLoading(true);
      const transaction = await openQClient.closeOngoing(library, bounty.bountyId);
      setModal({
        transaction,
        type: 'Closed Split Price',
      });
      setShowButton(false);
      refreshBounty();
    } catch (error) {
      logger.error(error, account, bounty.id);
      const { message, title } = openQClient.handleError(error, {
        bounty,
      });
      setError({
        message,
        title,
      });
    }
  }

  return (
    <>
      {showButton ? (
        <>
          <div className='flex flex-1 flex-col space-y-8 pt-4 pb-8 w-full max-w-[800px] justify-center'>
            <div className='flex flex-col space-y-2 items-center w-full md:border rounded-sm border-gray-700 text-primary pb-8'>
              <h1 className='flex w-full text-2xl justify-center px-12 py-4 md:bg-[#161b22] md:border-b border-gray-700 rounded-t-sm'>
                Settings
              </h1>
              <div className='flex flex-col space-y-5 w-full px-8 pt-2'>
                <h2 className='text-2xl border-b border-gray-700 pb-4'>Modifications</h2>
                <div className='flex items-center gap-2'>Set a New Budget for this Contract</div>
                <div className='flex-1 items-center w-full mt-2'>
                  <TokenFundBox
                    onCurrencySelect={onCurrencySelect}
                    onVolumeChange={onVolumeChange}
                    token={token}
                    volume={volume}
                  />
                </div>
                <button className='btn-default' type='button' onClick={setBudget}>
                  Set New Budget
                </button>

                {bounty.bountyType === '2' || bounty.bountyType === '3' ? (
                  <>
                    {bounty.bountyType === '2' && (
                      <>
                        <div className='flex flex-col items-center pb-2'>
                          <div className='flex flex-col w-full md:w-full'>
                            <div className='flex flex-col w-full items-start p-2 py-1 text-base pb-4'>
                              <div className='flex items-center gap-2'>
                                How many Tiers?
                                <ToolTipNew
                                  mobileX={10}
                                  toolTipText={`How many people will be able to claim a prize? Don't exceed 100.`}
                                >
                                  <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                                    ?
                                  </div>
                                </ToolTipNew>
                              </div>
                              <div className='flex-1 w-full mt-2'>
                                <input
                                  className={'flex-1 input-field w-full'}
                                  id='name'
                                  placeholder='0'
                                  autoComplete='off'
                                  type='text'
                                  min='0'
                                  max='100'
                                  defaultValue={tier}
                                  onChange={(e) => onTierChange(e)}
                                />
                              </div>
                            </div>
                            <SetTierValues
                              category={category}
                              sum={sum}
                              initialVolumes={bounty.payoutSchedule || []}
                              finalTierVolumes={finalTierVolumes}
                              setFinalTierVolumes={setFinalTierVolumes}
                              setSum={setSum}
                              tierArr={tierArr}
                              setEnableContest={setEnableContest}
                            />
                          </div>
                        </div>
                        <ToolTipNew
                          hideToolTip={(enableContest && isOnCorrectNetwork && account) || isLoading}
                          toolTipText={
                            account && isOnCorrectNetwork && !enableContest
                              ? 'Please make sure the sum of tier percentages adds up to 100.'
                              : isOnCorrectNetwork
                              ? 'Connect your wallet to mint a bounty!'
                              : 'Please switch to the correct network to mint a bounty.'
                          }
                        >
                          <button
                            className={`w-full btn-default ${enableContest ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            type='button'
                            onClick={setPayoutSchedule}
                            disabled={!enableContest}
                          >
                            Set New Payout Schedule
                          </button>
                        </ToolTipNew>
                      </>
                    )}

                    <h2 className='text-2xl text-[#f85149] border-b border-gray-700 pb-4'>Close Contract</h2>
                    <p className='flex items-center gap-2'>
                      Once you close the contract for this contest, there is no going back. Please be certain.
                    </p>
                    <p>
                      To allow contestants to claim their winnings, please also make sure their pull requests are
                      commented as needed before merging.
                    </p>
                    <button className='btn-danger' type='button' onClick={closeCompetition}>
                      Close Competition
                    </button>
                  </>
                ) : bounty.bountyType == '1' ? (
                  <>
                    <div className='flex items-center gap-2'>Set Payout for Each Submitter</div>

                    <div className='flex-1 items-center w-full mt-2'>
                      <TokenFundBox
                        onCurrencySelect={onPayoutTokenSelect}
                        onVolumeChange={onPayoutVolumeChange}
                        token={payoutToken}
                        volume={payoutVolume}
                      />
                    </div>
                    <button className='btn-default' type='button' onClick={setPayout}>
                      Set Payout
                    </button>

                    <h2 className='text-2xl text-[#f85149] border-b border-gray-700 pb-4'>
                      Close Split Price Contract
                    </h2>
                    <div className='flex justify-between items-center gap-2'>
                      Once you close this split price contract, there is no going back. Please be certain.
                    </div>
                    <button className='btn-danger' type='button' onClick={closeOngoing}>
                      Close Split Price Contract
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <ClaimText bounty={bounty} />
      )}

      {modal && <AdminModal setModal={setModal} modal={modal} />}
      {error && (
        <AdminModal
          setModal={setError}
          modal={{
            type: 'Error',
            ...error,
          }}
        />
      )}
    </>
  );
};

export default AdminPage;
