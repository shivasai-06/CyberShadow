import { RoundedBox } from '@react-three/drei';
import { CyberDeviceScreen } from './CyberDeviceScreen';

export function CyberMonitor({ position = [0, 0, 0], rotation = [0, 0, 0], isActive, renderContent, title, subtitle, color, status }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stand Base */}
      <RoundedBox args={[2, 0.1, 1.5]} radius={0.02} position={[0, 0.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2f3647" roughness={0.5} metalness={0.6} />
      </RoundedBox>
      
      {/* Stand Neck */}
      <RoundedBox args={[0.3, 1.8, 0.2]} radius={0.05} position={[0, 0.9, -0.4]} rotation={[0.1, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2f3647" roughness={0.5} metalness={0.6} />
      </RoundedBox>

      {/* Screen Body */}
      <group position={[0, 2, -0.2]}>
        {/* Back panel */}
        <RoundedBox args={[5.2, 3.2, 0.2]} radius={0.05} position={[0, 0, -0.1]} castShadow receiveShadow>
          <meshStandardMaterial color="#202533" roughness={0.6} metalness={0.5} />
        </RoundedBox>
        
        {/* Screen Bezel */}
        <RoundedBox args={[5.1, 3.1, 0.02]} radius={0.02} position={[0, 0, 0.01]} receiveShadow>
          <meshStandardMaterial color="#10121a" roughness={0.3} metalness={0.9} />
        </RoundedBox>
        
        {/* The HTML Screen content */}
        <group position={[0, 0, 0.025]}>
           <CyberDeviceScreen 
             title={title} 
             subtitle={subtitle} 
             isActive={isActive} 
             status={status}
             color={color} 
             width="1000px" 
             height="600px" 
             scale={0.005}
           >
             {renderContent()}
           </CyberDeviceScreen>
        </group>
      </group>
    </group>
  );
}
