import React, { useContext } from 'react';
import _ from 'lodash';

import { Link, useParams } from 'react-router-dom';
import { Capability, Device } from '@models/device';
import { Heartbeat } from '@components/heartbeat';
import { FleetContext } from '@components/fleet-context';
import { CircleArrowLeftIcon } from 'lucide-react';
import { JWTCapability } from '@components/jwt-capability';
import { BatteryIcon } from '@components/battery-icon';

import { MapComponent } from '@components/map-component';
import { getLogger} from '@transitive-sdk/utils-web';
import { TriggerServiceButton } from '@components/trigger-service-button';

const log = getLogger('DeviceSection');
log.setLevel('debug');


export function DeviceSection() {
  const { deviceId } = useParams();
  const { fleet } = useContext(FleetContext);

  const device = _.find(fleet, { id: deviceId }) as Device;
  if (!device) {
    return <div>Loading Device section</div>;
  }
  return (
    <>
      <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4
        lg:h-[60px] lg:px-6'>
        <h1 className='text-xl font-bold'>
          {device.name}
        </h1>
        <Heartbeat heartbeat={device.heartbeat} refresh={true} />
        <BatteryIcon deviceId={device.id} />
        <Link to='/dashboard/devices' className='flex-grow'>
          <CircleArrowLeftIcon className='h-6 w-6 float-right' />
        </Link>
      </header>

      <main className='grid p-4 lg:p-6 overflow-y-auto'>
        <div
          className='flex flex-wrap gap-6 p-4 items-stretch content-start
          rounded-lg border border-dashed shadow-sm relative'
        >
          {_.some(device.capabilities, (capability: Capability) =>
            capability.id === 'remote-teleop') && (
              <div className='grow-0 basis-3/5 shrink m-auto'>
                <JWTCapability
                  device={deviceId}
                  capability={'@transitive-robotics/remote-teleop'}
                  control_rosVersion="1"
                  control_topic="/joy"
                  control_type="sensor_msgs/Joy"
                  count="4"
                  framerate="15/1"
                  framerate_1="15/1"
                  framerate_2="15/1"
                  framerate_3="15/1"
                  height="360"
                  height_1="480"
                  height_2="540"
                  height_3="360"
                  quantizer="25"
                  source="/dev/video18"
                  source_1="/dev/video6"
                  source_2="/dev/video8"
                  source_3="/dev/video10"
                  streamtype="video/x-raw"
                  streamtype_1="image/jpeg"
                  streamtype_2="video/x-raw"
                  streamtype_3="image/jpeg"
                  timeout="1800"
                  type="v4l2src"
                  type_1="v4l2src"
                  type_2="v4l2src"
                  type_3="v4l2src"
                  width="640"
                  width_1="640"
                  width_2="960"
                  width_3="640"
                  />
              </div>
            )}

          <div className='grow'>
            <div>
              <div className='h-80'>
                <MapComponent deviceId={deviceId} />
              </div>
              <div className='p-2'>
                <TriggerServiceButton deviceId={deviceId} service={'/dock'}
                  successToast='Arrived to Dock!'>
                  Return to dock
                </TriggerServiceButton>&nbsp;
                <TriggerServiceButton deviceId={deviceId} service={'/goto_philz_coffee'}
                  successToast="Arrived to Philz Coffee!">
                  Go to Philz Coffee
                </TriggerServiceButton>
              </div>
            </div>
            {_.some(device.capabilities, (capability: Capability) =>
              capability.id === 'health-monitoring') && (
                <div>
                  <JWTCapability device={deviceId}
                    capability={'@transitive-robotics/health-monitoring'}
                    delimiters={'undefined'}/>
                </div>
            )}
          </div>

          {_.some(device.capabilities, (capability: Capability) =>
            capability.id === 'terminal') && (
              <div className='w-full h-1/4'>
                <JWTCapability device={deviceId}
                  capability={'@transitive-robotics/terminal'} />
              </div>
          )}
        </div>
      </main>
    </>
  );
}