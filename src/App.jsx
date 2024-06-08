import { useState } from 'react'
import './App.css'
import Lobby from './Lobby';
import VideoRoom from './VideoRoom';

const App = () => {
  const [isLobbySetup, setLobbySetup] = useState(false);
  const [videoDevice, setVideoDevice] = useState(null);
  const [audioDevice, setAudioDevice] = useState(null);
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);

  return (
    <>
      {isLobbySetup ?
      <VideoRoom
        setLobbySetup={setLobbySetup}
        videoDevice={videoDevice}
        audioDevice={audioDevice}
      /> :
      <Lobby
        audioDevices={audioDevices}
        setAudioDevices={setAudioDevices}
        videoDevices={videoDevices}
        setVideoDevices={setVideoDevices}
        setLobbySetup={setLobbySetup}
        videoDevice={videoDevice}
        audioDevice={audioDevice}
        setAudioDevice={setAudioDevice}
        setVideoDevice={setVideoDevice}
      />}
    </>
  );
}

export default App
