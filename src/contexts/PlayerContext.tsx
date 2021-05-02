import {
  createContext,
  useState,
  ReactNode,
  useContext
} from "react";

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string
};

type PlayerContextData = {
  episodes: Episode[],
  currentEpisodeIndex: number,
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  hasNext: boolean,
  hasPrevious: boolean,
  clearPlayerState: () => void,
  play: (episode: Episode) => void,
  togglePlay: () => void,
  toggleLoop: () => void,
  toggleShuffling: () => void,
  playNext: () => void,
  playPrevious: () => void,
  playList: (list: Episode[], index: number) => void,
  setPlayingState: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);


type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodes, setEpisodes] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode) {
    setEpisodes([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodes(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function clearPlayerState(){
    setEpisodes([]);
    setCurrentEpisodeIndex(0);
  }

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodes.length
  const hasPrevious = currentEpisodeIndex > 0

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodes.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffling() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider
      value={{
        play,
        episodes,
        playList,
        playNext,
        hasPrevious,
        hasNext,
        playPrevious,
        isShuffling,
        isPlaying,
        isLooping,
        togglePlay,
        clearPlayerState,
        toggleShuffling,
        toggleLoop,
        setPlayingState,
        currentEpisodeIndex
      }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}