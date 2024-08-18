import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import SpotifyWebApi from "spotify-web-api-node";
import morgan from "morgan";
import config from "./config.js";
import axios from "axios";
import chalk from "chalk";
import fetch from "node-fetch"; // Refresh token için fetch ekleyin

const app = express();

// Spotify API istemcisini oluştur
const spotifyApi = new SpotifyWebApi({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: 'http://localhost:5000/callback'
});

// Bağlantıyı yapın
mongoose.connect('mongodb://192.168.1.105/');

// Statistikler için şema ve model
const statsSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 1
    },
    visitor: {
        type: Number,
        default: 0
    }
});
const Stats = mongoose.model('stats', statsSchema);

// Şarkılar için şema ve model
const trackSchema = new mongoose.Schema({
    name: String,
    url: String,
    album_image: String,
    artist: [String],
    timestamp: { type: Date, default: Date.now }
});
const Track = mongoose.model('Track', trackSchema);

// İlk başlatma
const initialize = async () => {
    if (!await Stats.findOne({ id: 1 })) {
        await new Stats({ id: 1, visitor: 0 }).save();
    }
};
initialize();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // JSON body parsing

app.get('/login', (req, res) => {
    const scopes = ['user-read-currently-playing'];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
});

// Callback endpoint to handle Spotify authorization response
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    console.log(code);
    if (code) {
        try {
            const data = await spotifyApi.authorizationCodeGrant(code);
            const accessToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];
            console.log(chalk.red(accessToken));
            console.log(chalk.green(refreshToken));

            // Save tokens securely (e.g., in a database)
            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);
            config.token = accessToken;
            config.refreshToken = refreshToken; // Updated to use refreshToken
            res.send('Access token acquired and set.');
        } catch (error) {
            console.error('Error during authorization:', error);
            res.status(500).send('Error during authorization.');
        }
    } else {
        res.status(400).send('Authorization code not provided.');
    }
});

app.post('/', async (req, res) => {
    const stats = await Stats.findOne({ id: 1 });
    let visitor = stats.visitor + 1;
    await Stats.findOneAndUpdate({ id: 1 }, {
        visitor: visitor
    });
    res.send('Visitor count updated.');
});

app.get('/stats', async (req, res) => {
    const stats = await Stats.findOne({ id: 1 });
    res.status(200).json({
        visitor: stats.visitor
    });
});

const getAccessToken = async () => {
    if (!config.refreshToken) {
        throw new Error('No refresh token available.');
    }

    const url = "https://accounts.spotify.com/api/token";
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: config.refreshToken
        }),
    };

    try {
        const response = await fetch(url, payload);
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error_description);
        }
        const newAccessToken = data.access_token;
        spotifyApi.setAccessToken(newAccessToken);
        config.token = newAccessToken;
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
};

app.post('/saveCurrentTrack', async (req, res) => {
    try {
        const token = config.token;
        let response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch(async error => {
            if (error.response.status === 401) {
                // Access token expired, refresh it
                await getAccessToken();
                response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
                    headers: {
                        'Authorization': `Bearer ${config.token}`
                    }
                });
            } else {
                throw error;
            }
        });

        const data = response.data;

        const track = {
            name: data.item.name,
            url: data.item.external_urls.spotify,
            album_image: data.item.album.images[0] ? data.item.album.images[0].url : null,
            artist: data.item.artists.map(artist => artist.name)
        };

        // Şarkıyı veritabanına kaydet
        await Track.create(track);

        res.status(200).json({ message: 'Track saved successfully.' });
    } catch (error) {
        console.error('Error saving track:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/tracks', async (req, res) => {
    try {
        const tracks = await Track.find().sort({ timestamp: -1 });  // En son eklenen şarkılar ilk sırada
        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error retrieving tracks:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/currentlyPlaying', async (req, res) => {
    try {
        let response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${config.token}`
            }
        }).catch(async error => {
            if (error.response.status === 401) {
                // Access token expired, refresh it
                await getAccessToken();
                response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
                    headers: {
                        'Authorization': `Bearer ${config.token}`
                    }
                });
            } else {
                throw error;
            }
        });

        const data = response.data;
        const result = {
            is_playing: data.is_playing,
            track: {
                name: data.item.name ? data.item.name : 'Reklamlar..',
                url: data.item.external_urls.spotify
            },
            album_image: data.item.album.images[0] ? data.item.album.images[0].url : null,
            artist: data.item.artists
        };

        res.status(200).json(result);
    } catch (error) {
        console.error('Spotify API hata:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
