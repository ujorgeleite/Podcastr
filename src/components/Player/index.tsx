import {
  useContext,
  useEffect,
  useRef
} from 'react'
import Image from 'next/image'
import Slider from 'rc-slider'

import { PlayerContext } from '../../contexts/PlayerContext'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
export function Player() {

  const audioRef = useRef<HTMLAudioElement>(null)

  const { episodes,
    isPlaying,
    togglePlay,
    setPlayingState,
    currentEpisodeIndex } = useContext(PlayerContext)


  useEffect(() => {
    if(!audioRef.current){
      return;
    }
    
    if(isPlaying){
      audioRef.current.play();
    }else{
      audioRef.current.pause();
    }

  },[isPlaying])

  const episode = episodes[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando Agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>)}


      <footer className={!episode ? styles.empty : ''}>
        {episode && (
          <audio src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setPlayingState(true) }
            onPause={() => setPlayingState(false) }>
            
          </audio>
        )}
        <div className={styles.progress}>
          <span>00:00</span>
          {
            episode ? <Slider trackStyle={{ backgroundColor: "#04d361" }}
              railStyle={{ backgroundColor: "#9f75ff" }}
              handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}>

            </Slider> :
              <div className={styles.emptySlider} />
          }

          <span>00:00</span>
        </div>
        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>
          <button type="button" disabled={!episode}>
            <img src='/play-previous.svg' alt='Tocar anterior' />
          </button>
          <button type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}>
            {
              isPlaying ? <img src='/pause.svg' alt='Tocar' /> :
                <img src='/play.svg' alt='Tocar' />
            }

          </button>
          <button type="button">
            <img src='/play-next.svg' alt='Tocar Próxima' />
          </button>
          <button type="button" disabled={!episode}>
            <img src='/repeat.svg' alt='Repetir' />
          </button>

        </div>
      </footer>
    </div>
  )
}