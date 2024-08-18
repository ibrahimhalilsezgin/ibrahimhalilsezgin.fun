import axios from 'axios';

// Örnek access token (geçerli bir token ile değiştirin)
const accessToken = 'BQBKNGyL4_yvmX03pPVMy6xG6xEIsFBagiJ3yxkApDPPXhiMx7pa2u_ctEZfVk5Jl_vlur3rih24blGys4Xsiewg5Da1nk7nKvABAfIoFwNOEcJszpc';

axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Spotify API Hatası:', error.response ? error.response.data : error.message);
});
