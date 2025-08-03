const express = require("express");
const axios = require("axios");
const app = express();

app.get("/friends/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const userRes = await axios.get(`https://api.roblox.com/users/get-by-username?username=${username}`);
    const userId = userRes.data.Id;
    if (!userId) return res.status(404).json({ error: "User not found" });

    const friendsRes = await axios.get(`https://friends.roblox.com/v1/users/${userId}/friends`);
    const friends = friendsRes.data.data.map(friend => ({
      name: friend.name,
      displayName: friend.displayName,
      id: friend.id
    }));

    res.json({ username, userId, friends });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App is running on port 3000");
});
