import { RoundedBox } from '@react-three/drei';
import { CyberDeviceScreen } from './CyberDeviceScreen';

export function CyberPhone({ position = [0, 0, 0], rotation = [0, 0, 0], isActive, renderContent, title, subtitle, color, status }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Phone Body */}
      <RoundedBox args={[0.9, 1.8, 0.08]} radius={0.08} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#303645" roughness={0.4} metalness={0.8} />
      </RoundedBox>
      
      {/* Phone Screen Bezel */}
      <RoundedBox args={[0.85, 1.75, 0.01]} radius={0.06} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#10121a" roughness={0.1} metalness={0.8} />
      </RoundedBox>

      {/* Screen Content */}
      <group position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <CyberDeviceScreen 
             title={title || "MOBILE DEVICE"} 
             subtitle={subtitle || "SMARTPHONE"} 
             isActive={isActive} 
             status={status}
             color={color || "#06b6d4"} 
             width="400px" 
             height="800px" 
             scale={0.0021}
           >
             {renderContent()}
        </CyberDeviceScreen>
      </group>
    </group>
  );
}
