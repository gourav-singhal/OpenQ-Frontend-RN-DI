import { useContext, useEffect, useState } from 'react';
import React from 'react';
import StoreContext from '../store/Store/StoreContext';
import useGetTokenValues from '../hooks/useGetTokenValues';

const Admin = () => {
  const [appState] = useContext(StoreContext);
  const [coreMetrics, setCoreMetrics] = useState();
  const [previousClaimValues] = useGetTokenValues(coreMetrics?.previousClaims);
  const [currentClaimValues] = useGetTokenValues(coreMetrics?.currentClaims);
  const [previousDepositsValues] = useGetTokenValues(coreMetrics?.previousDeposits);
  const [currentDepositValues] = useGetTokenValues(coreMetrics?.currentDeposits);
  const [totalLockedValues] = useGetTokenValues(coreMetrics?.totalBalances);
  useEffect(async () => {
    const currentTime = parseInt(Date.now() / 1000);
    const month = 2629800;
    const previousTime = currentTime - month;
    const toTrueString = (num) => {
      return num.toLocaleString('fullwide', { useGrouping: false });
    };
    const times = { previousTimestamp: toTrueString(previousTime), currentTimestamp: toTrueString(currentTime) };

    console.log(times);
    const coreMetrics = await appState.openQSubgraphClient.getCoreValueMetrics(times);
    setCoreMetrics(coreMetrics);
  }, []);
  return (
    <div className='flex gap-8 justify-center content-center items-center min-h-[calc(100vh_-_246px)] text-xl font-semibold  text-muted'>
      <div className='justify-center flex content-center items-center bg-black  rounded-lg w-40 h-44'>
        <span> TVL ${totalLockedValues?.total}</span>
      </div>
      <table className='justify-center justify-items-center bg-black rounded-lg'>
        <thead>
          <tr>
            <td></td>
            <th className='px-4 py-4 '>Gross Value Funded</th>
            <th className='px-4 py-4 '>Gross Value Claimed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='px-4 py-4 '>This Month</td>
            <td className='px-4 py-4 '>${currentDepositValues?.total || '0.00'}</td>
            <td className='px-4 py-4 '>${currentClaimValues?.total || '0.00'}</td>
          </tr>
          <tr>
            <td className='px-4 py-4 '>Previous Month</td>
            <td className='px-4 py-4 '>${previousDepositsValues?.total || '0.00'}</td>
            <td className='px-4 py-4 '>${previousClaimValues?.total || '0.00'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Admin;
