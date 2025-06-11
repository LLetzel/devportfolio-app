// src/api/github.js
import axios from 'axios';

export const fetchGitHubRepos = async (username) => {
  const res = await axios.get(`https://api.github.com/users/${username}/repos`);
  return res.data;
};
