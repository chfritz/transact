import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { CapabilityContext, CapabilityContextProvider, getLogger }
  from '@transitive-sdk/utils-web';

import DeviceSelector from '@components/device-selector';
import { JWTCapability } from "@components/jwt-capability";
import { JWTContext, JWTContextProvider } from "@components/jwt-context";

const log = getLogger('health');
log.setLevel('debug');

const host = import.meta.env.VITE_HOST; // Transitive deployment
const insecure = import.meta.env.VITE_INSECURE

const ROSTool = ({ device }) => {
  const { ready, subscribe, deviceData } = useContext(CapabilityContext);

  useEffect(() => {
    if (ready) {
      console.log('subscribing', device);
      subscribe(1, "/myname");
    }
  }, [ready, device]);

  log.debug({device, deviceData});

  return <div>
    ROS Tool: {device}, {deviceData?.ros?.[1].messages?.myname.data}
  </div>
}

const ROSToolContext = ({ device }) => {
  const jwt = useContext(JWTContext);

  return <CapabilityContextProvider jwt={jwt} host={host} ssl={!insecure}>
    <ROSTool device={ device } />
  </CapabilityContextProvider>;
};

export function HealthSection() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col'>
      <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
        <div className='w-full flex-1'>
          <div className='relative'>
            <DeviceSelector deviceId={deviceId} capability='health-monitoring'
              onChange={(id: string) => navigate(`/dashboard/health/${id}`)}/>
          </div>
        </div>
      </header>
      <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
        <div
          className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'
        >
          {deviceId && <JWTCapability device={deviceId} capability={'@transitive-robotics/health-monitoring'} delimiters={'undefined'}/>}
        </div>
      </main>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        >
          {device &&
              <JWTContextProvider device={device}
                capability='@transitive-robotics/ros-tool'>
                <ROSToolContext device={device} />
              </JWTContextProvider>
          }
        </div>
      </main>
    </div>
  );
}