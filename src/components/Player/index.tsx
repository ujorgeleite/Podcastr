import {
  useEffect,
  useRef,
  useState
} from 'react'
import Image from 'next/image'
import Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
export function Player() {

  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const { episodes,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffling,
    playPrevious,
    playNext,
    hasPrevious,
    clearPlayerState,
    hasNext,
    setPlayingState,
    currentEpisodeIndex } = usePlayer()


  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

  }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  } 

  function handleEpisodeEnded(){
    if(hasNext){
      playNext();
    }else{
      clearPlayerState();
    }
  }

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
            loop={isLooping}
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}>

          </audio>
        )}
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          {
            episode ? <Slider trackStyle={{ backgroundColor: "#04d361" }}
              max={episode.duration}
              value={progress}
              onChange={handleSeek}
              railStyle={{ backgroundColor: "#9f75ff" }}
              handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}>

            </Slider> :
              <div className={styles.emptySlider} />
          }

          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>
        <div className={styles.buttons}>
          <button type="button"
            disabled={!episode || isLooping}
            onClick={toggleShuffling}
            className={isShuffling ? styles.isActive : ''}>
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
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
          <button type="button"
            disabled={!episode || !hasNext}
            onClick={() => playNext()}>
            <img src='/play-next.svg' alt='Tocar Próxima' />
          </button>
          <button type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}>
            <img src='/repeat.svg' alt='Repetir' />
          </button>

        </div>
      </footer>
    </div>
  )
}