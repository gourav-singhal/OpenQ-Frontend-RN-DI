// Third Party
import React from 'react';
import Head from 'next/head';

// Custom
// import BountyHomepage from '../components/Bounty/BountyHomepage';
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';

export default function Index() {
	return (
		<div>
			<Head>
				<title>OpenQ</title>
				<meta
					name="OpenQ Bounties"
					content="width=device-width, initial-scale=1.0"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<div className="bg-dark-mode pl-12 pt-10 flex-col">
					<OrganizationHomepage />
					{/* <BountyHomepage /> */}
				</div>
			</main>
		</div>
	);
}
