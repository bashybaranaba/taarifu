import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Web3Modal from "web3modal";

import AppNavBar from "@/src/components/layout/AppNavBar";
import SideNav from "@/src/components/layout/SideNav";
import PostList from "@/src/components/posts/PostList";
import CreatePost from "@/src/components/posts/CreatePost/CreatePost";
import HomeBanner from "@/src/components/layout/HomeBanner";

import { TaarifuAddress } from "../config.js";
import Taarifu from "../artifacts/contracts/Taarifu.sol/Taarifu.json";

export default function BasicTextFields() {
  const [newsItems, setNewsItems] = useState([]);
  const [loadingState, setLoadingState] = useState("nor-loaded");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadNewsItems();
  }, []);

  async function loadNewsItems() {
    setLoading(true);
    /* create a generic provider and query new items */
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(TaarifuAddress, Taarifu.abi, provider);
    const data = await contract.fetchAllNewsItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their metadata
     */
    const items: any[] = await Promise.all(
      data.map(async (i: any) => {
        let item = {
          newsId: i.newsId.toNumber(),
          poster: i.poster,
          content: i.content,
          worthinessVotes: i.worthinessVotes.toNumber(),
          totalVotes: i.totalVotes.toNumber(),
          verified: i.verified,
        };
        return item;
      })
    );
    setNewsItems(items);
    setLoading(false);
    setLoadingState("loaded");
  }

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item lg={3}>
          <HomeBanner />
          <SideNav />
        </Grid>
        <Grid item lg={6}>
          <CreatePost />
          {loading ? <LinearProgress sx={{ ml: 2, mr: 2 }} /> : null}
          <PostList posts={newsItems} />
          {loadingState === "loaded" && !newsItems.length ? (
            <Box sx={{ m: 3 }}>
              <Typography variant="h6">No posts yet</Typography>
            </Box>
          ) : null}
        </Grid>
        <Grid item lg={3}></Grid>
      </Grid>
    </Box>
  );
}
