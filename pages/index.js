import Head from "next/head";
import Image from "next/image";
import BountyCardList from "../components/BountyCards/BountyCardList";
import BountySearch from "../components/BountySearch";
import ConnectWallet from "../components/ConnectWallet";
import AddNetworkButton from "../components/AddNetworkButton";
import AuthButton from "../components/Authentication/AuthButton";
import CreateBounty from "../components/CreateBounty";
import StackSearch from "../components/StackSearch";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useState, useContext } from "react";
import { setContext } from "@apollo/client/link/context";
import { useQuery } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import ProfilePicture from "../components/ProfilePicture";
import React from "react";
import axios from "axios";
import StoreContext from "../store/Store/StoreContext";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const [appState, appStateDispatch] = useContext(StoreContext);

  useAuth();

  return (
    <div>
      <Head>
        <title>OpenQ</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex pl-12 pt-5 pr-12 items-center justify-between">
          <h1 className="font-mont font-bold text-4xl">Dashboard</h1>
          <CreateBounty />
        </div>
        <div className="flex pl-12 pt-5 flex-col">
          <h2 className="font-mont font-normal text-lg text-gray-700">Layer</h2>
          <div className="flex pt-3 flex-grow flex-row space-x-2">
            <button className="layer-button">Front-End</button>
            <button className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer border-pink-400  text-gray-800 hover:bg-pink-400 hover:text-white">
              Back-End
            </button>
          </div>
        </div>
        <div className="flex pl-12 pt-5 flex-col">
          <h2 className="font-mont font-normal text-lg text-gray-700">Stack</h2>
          <div className="flex pt-3 flex-grow flex-row space-x-2">
            <StackSearch />
          </div>
        </div>
        <div className="flex pl-12 pt-10 flex-col">
          <BountyCardList />
        </div>
      </main>
    </div>
  );
}
