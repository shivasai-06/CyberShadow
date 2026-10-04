import { CyberDeviceScreen } from './CyberDeviceScreen';

export function CyberOutcome({ position = [0, 0, 0], rotation = [0, 0, 0], isActive, renderContent, status }: any) {
  if (!isActive) return null;

  return (
    <group position={position} rotation={rotation}>
      {/* Large Holographic Screen */}
      <CyberDeviceScreen 
           title="SIMULATION COMPLETE" 
           subtitle="OUTCOME ANALYSIS" 
           isActive={true} 
           status={status}
           color={status === 'BLOCKED' ? '#10b981' : '#ef4444'} 
           width="1200px" 
           height="800px" 
           scale={0.006}
         >
           {renderContent()}
      </CyberDeviceScreen>
    </group>
  );
}
