"use client"
import { DeviceSettings, VideoPreview, useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Alert from './Alert'

const MeetingSetup = ({setIsSetupComplete}:{setIsSetupComplete: (val: boolean) => void}) => {
    const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

    if (!call) {
        throw new Error(
        'useStreamCall must be used within a StreamCall component.',
        );
    }
    const [isMicCamToggledon, setIsMicCamToggledOn] = useState(false)
    if(!call) {
        throw new Error("useCall must be used within StreamCall component");
    }
    useEffect(() => {
        if(isMicCamToggledon){
            call?.camera.disable();
            call?.microphone.disable();
        } else {
            call?.camera.enable();
            call?.microphone.enable();
        }
    }, [isMicCamToggledon, call?.camera, call?.microphone])
    if (callTimeNotArrived)
        return (
          <Alert
            title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
          />
        );
    
      if (callHasEnded)
        return (
          <Alert
            title="The call has been ended by the host"
            iconUrl="/icons/call-ended.svg"
          />
        );
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
    <h1 className='text-center text-2xl font-bold'>Setup</h1>
    <VideoPreview />
    <div className='flex h-16 items-center justify-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium'>
            <input type='checkbox' checked={isMicCamToggledon} onChange={(e) => setIsMicCamToggledOn(e.target.checked)}/>
            Join with mic and camera off
        </label>
        <DeviceSettings />
        <Button className='rounded-md bg-green-500 px-4 py-2.5' onClick={() => {
            call.join();
            setIsSetupComplete(true)
        }}>
            Join Meeting
        </Button>
    </div>
    </div>
  )
}

export default MeetingSetup
