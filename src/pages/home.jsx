import { useEffect, useState } from "react";
import NumberTicker from "@/@/components/magicui/number-ticker";
import Meteors from "@/@/components/magicui/meteors";
import Navbar from "@/Components/Navbar";
import axios from "axios";

//  https://api.wakatime.com/api/v1/
const Home = () => {
  const [stat, setStat] = useState({ visitor: 0 });
  const [spotify, setSpotify] = useState({
    album: {},
    isPlaying: false,
    item: {},
    artist: [],
    artist_id: [],
    image: ''
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const { data } = await axios.get("/stats");
        setStat({ visitor: data.visitor });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const getSpotify = async () => {
      try {
        const { data } = await axios.get('/currentlyPlaying');
        setSpotify({
          album: data.track,
          isPlaying: data.is_playing,
          image: data.album_image,
          artist: data.artist.map(a => a.name), // Sanatçı isimlerini array olarak sakla
          artist_id: data.artist.map(a => a.id)
        });
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
      }
    };
    var timestamp = 1194644981;

    function updateAge() {
        var currentTime = Date.now();
    
        var startDate = new Date(timestamp * 1000);
        var timeDifference = currentTime - startDate.getTime();
        var ageInYears = timeDifference / (1000 * 60 * 60 * 24 * 365.25);
        document.getElementById('old').textContent = `${ageInYears.toFixed(8)} y.o`;
    }
    
    setInterval(updateAge);
    
    updateAge();
    getStats();
    getSpotify();
    setInterval(() => {
      getSpotify();
    }, 3 * 1000)
  }, []);

  useEffect(() => {
    window.onload = () => {
      if(window.innerWidth >= 414) {
        console.log(window.innerWidth)
        document.querySelector('#infos').className = 'stat place-items-center flex flex-col'
      } 
    }

    window.addEventListener('resize', () => {
      if(window.innerWidth >= 414) {
        console.log(window.innerWidth)
        document.querySelector('#infos').className = 'stat place-items-center flex flex-col '
      } else document.querySelector('#infos').className = 'stat place-items-center flex-row  '


    })
  })


  const artistNames = spotify.artist.join(", "); // Sanatçı isimlerini virgülle ayır

  return (
    <>
      <Navbar />

      <div className="relative flex h-1/2 w-full flex-col items-center justify-center overflow-hidden  bg-background">
      <Meteors number={80} />

        <span className="space-y-8 bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-6xl lg:text-8xl">
          <h2 className="text-white text-6xl">Ibrahim Halil Sezgin </h2>
          <span id="old" className="text-sm text-white pb-28"></span>
          
          <div>

          <div id="infos" className="stat place-items-center flex flex-col">
          {

            spotify.image ?    
            <div className="max-w-sm bg-gray-900 text-white rounded-lg shadow-md p-4 flex space-x-4 items-center space-y-4 mx-4 md:mx-8 lg:mx-16">
            <img src={spotify.image} alt="Song Image" className="w-24 h-24 rounded-lg md:w-32 md:h-32" />
            <div className="text-center">
              <div className="text-lg font-bold">{spotify.album.name}</div>
              <div className="text-sm text-gray-400">
                <a className="cursor-pointer" href={"https://open.spotify.com/artist/" + spotify.artist_id.join(",")}>
                  {artistNames}
                </a>
              </div> {/* Sanatçı isimlerini burada göster */}
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <svg className="w-5 h-5 mr-1 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10-10-4.48-10-10 4.48-10 10-10zm-2.27 15.27c.8.8 2.07.8 2.87 0l5.67-5.67c.8-.8.8-2.07 0-2.87s-2.07-.8-2.87 0l-5.67 5.67c-.8.8-.8 2.07 0 2.87zm6.07-6.07l1.76-1.76c.8-.8.8-2.07 0-2.87s-2.07-.8-2.87 0l-1.76 1.76 2.87 2.87zm-7.34 4.67c.8-.8 2.07-.8 2.87 0l5.67-5.67c.8-.8.8-2.07 0-2.87s-2.07-.8-2.87 0l-5.67 5.67c-.8.8-.8 2.07 0 2.87zm.34 3.73c0-1.06.86-1.92 1.92-1.92s1.92.86 1.92 1.92-.86 1.92-1.92 1.92-1.92-.86-1.92-1.92z"/>
                </svg>
                Last Played on Spotify
              </div>
            </div>
          </div>

          :

          <div className="max-w-sm bg-gray-900 text-white rounded-lg shadow-md p-4 flex space-x-4 items-center mx-4 md:mx-8 lg:mx-16">
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png" alt="Song Image" className="w-24 h-24 rounded-lg md:w-32 md:h-32" />
          <div className="text-center">
            <div className="text-lg font-bold">Her Hangi Bir Şarkı Çalmıyor</div>
            <div className="text-sm text-gray-400">
              <a className="cursor-pointer" href={"https://open.spotify.com/artist/" + spotify.artist_id.join(",")}>
                {artistNames}
              </a>
            </div>
          </div>
        </div>



          }
	          </div>
          </div>
          
        </span>
      
      </div>
    </>
  );
}

export default Home;
