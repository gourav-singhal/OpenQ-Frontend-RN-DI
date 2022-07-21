// Third party
import React from 'react';
import { useRouter } from 'next/router';
// Custom
import Image from 'next/image';

const SignIn = ({ redirectUrl, styles }) => {
	const router = useRouter();

	const signIn = () => {
		const clientId = `client_id=${process.env.NEXT_PUBLIC_OPENQ_ID}`;
		const nonce = randomString(10);
		window.localStorage.setItem('csrf_nonce', nonce);
		const state = {
			[nonce]: {
				redirectUrl,
			},
		};
		const stateParams = `state=${JSON.stringify(state)}`;
		router.push(
			`https://github.com/login/oauth/authorize?${clientId}&${stateParams}`
		);
	};

	function randomString(length) {
		return Array(length + 1)
			.join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
			.slice(0, length);
	}

	return (
		<button
			onClick={() => signIn()}
			className="flex items-center btn-default whitespace-nowrap px-3 py-2 mr-2 hover:border-[#8b949e] hover:bg-[#30363d]"
		>
			<div className="flex flex-row items-center justify-center space-x-3">
				<Image
					src="/social-icons/github-logo-white.svg"
					alt="Picture of the author"
					width={20}
					height={20}
				/>
				<div>Sign In</div>
			</div>
		</button>
	);
};

export default SignIn;
