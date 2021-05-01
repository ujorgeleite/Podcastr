import { useState } from 'react'
import { PlayerContext } from '../contexts/PlayerContext'

import { Player } from '../components/Player'
import { Header } from '../components/Header'

import '../styles/global.scss'
import styles from '../styles/app.module.scss'
function MyApp({ Component, pageProps }) {
  const [episodes, setEpisodes] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  function play(episode){
    setEpisodes([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
    
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }


  return (
    <PlayerContext.Provider value={{episodes, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState}}>
    <div className={styles.wrapper}>
    <main>
    <Header/>
    <Component {...pageProps} />
    </main>
    <Player/>
    </div>
    </PlayerContext.Provider>
    )
  }
  
  export default MyApp
  