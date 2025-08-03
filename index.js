const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/friends/:username", async (req, res) => {
    const username = req.params.username;

    try {
        const userIdRes = await fetch("https://users.roblox.com/v1/usernames/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usernames: [username],
                excludeBannedUsers: false
            })
        });

        const userIdData = await userIdRes.json();
        const user = userIdData.data[0];

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = user.id;

        const friendsRes = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`);
        const friendsData = await friendsRes.json();

        if (!friendsData.data) {
            return res.status(500).json({ error: "Failed to fetch friends" });
        }

        const friendList = friendsData.data.map(f => `${f.name} (ID: ${f.id})`);

        res.json({
            username: username,
            friends: friendList
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
