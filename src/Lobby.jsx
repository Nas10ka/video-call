import { useState, useEffect, useRef } from "react";
import Card from '@mui/material/Card';
import Typography from '@mui/joy/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardCover from '@mui/joy/CardCover';
import Button from '@mui/material/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import OT from '@opentok/client';
import PropTypes from 'prop-types';
import { handleError, parseUserAgent } from './helper';

const Lobby = ({
  setAudioDevice,
  setVideoDevice,
  audioDevice,
  videoDevice,
  setLobbySetup,
  audioDevices,
  videoDevices,
  setAudioDevices,
  setVideoDevices,
}) => {
  const videoElement = useRef(null);
  const videoDeviceSelect = useRef(null);

  const join = () => setLobbySetup(true)

  const handleAudioDeviceChanged = (event, deviceId) => {
    setAudioDevice(deviceId);
  }

  const handleVideoDeviceChanged = async (event, deviceId) => {
    setVideoDevice(deviceId);
  }

  const handleDeviceChanged = async (audioDeviceId, videoDeviceId) => {
    try {
      const constraints = {
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : null,
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : null
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.current.srcObject = newStream;    
    } catch (error) {
      handleError(`Error accessing media devices: ${error}`);
    }
  }

  useEffect(() => {
    handleDeviceChanged(audioDevice, videoDevice);
  }, [videoDevice])

  const getDeviceSources = () => 
    OT.getDevices((error, devices) => {
      if (error) {
        handleError(`Error of getting devices:  ${error}`);
      }
    const { audioSources, videoSources } = devices.reduce((result, device) => {
        if (device.kind === 'audioInput') {
          
          result.audioSources = [...result.audioSources, {
            kind: device.kind,
            label: device.label,
            deviceId: device.deviceId
          }];
        } else if (device.kind === 'videoInput') {
          result.videoSources = [...result.videoSources,{
            kind: device.kind,
            label: device.label,
            deviceId: device.deviceId
          }];
        }
        return result;
      }, { audioSources: [], videoSources: []});
      setAudioDevices(audioSources);
      setVideoDevices(videoSources);
      setAudioDevice(audioSources?.[0]?.deviceId);
      setVideoDevice(videoSources?.[0]?.deviceId);
      
    });
  const getUserMediaPermission = () => {
    OT.getUserMedia().then((stream) => {
      getDeviceSources();
      stream.getTracks().forEach(track => track.stop());
    });
  }

  useEffect(() => {
    if (!audioDevice || !videoDevice) {
      getUserMediaPermission();
    }
  },[])

  return (
    <Card className='lobby' sx={{ width: 800, position: 'relative', height: '80vh' }}>
      <CardCover className='lobby__video' >
          <video
            ref={videoElement}
            autoPlay
          />
      </CardCover>
      <CardContent className="lobby__settings" sx={{ width: '300px' }}>
          <Typography variant="solid" color="primary" sx={{ zIndex: 1, position: 'relative', textAlign: 'center'}}>
            You are joining from {parseUserAgent()}</Typography>
        <Select
          ref={videoDeviceSelect}
          onChange={handleVideoDeviceChanged}
          value={videoDevice || videoDevices[0]?.deviceId}
          placeholder="Select video source"
          startDecorator={<VideoCameraFrontIcon />}
          sx={{ width: 240 }}
        >
          {videoDevices.map((device) =>
            <Option key={device.deviceId} value={device.deviceId}>{device.label || `audio-${device.deviceId}`}</Option>)}
        </Select>
        <Select
          onChange={handleAudioDeviceChanged}
          value={audioDevice || audioDevices[0]?.deviceId}
          placeholder="Select audio source"
          startDecorator={<SettingsVoiceIcon />}
          sx={{ width: 240 }}
        >
          {audioDevices.map((device) =>
            <Option key={device.deviceId} value={device.deviceId}>{device.label || `video-${device.deviceId}`}</Option>)}
        </Select>
        <CardActions>
          <Button variant="contained" size="small" onClick={join}>Join</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}

Lobby.propTypes = {
  setAudioDevice: PropTypes.func,
  setVideoDevice: PropTypes.func,
  setLobbySetup: PropTypes.func,
  audioDevice: PropTypes.string,
  videoDevice: PropTypes.string,
  audioDevices: PropTypes.array,
  videoDevices: PropTypes.array,
  setAudioDevices: PropTypes.func,
  setVideoDevices: PropTypes.func,
}

export default Lobby;
