import { RoundedBox } from '@react-three/drei';
import { CyberDeviceScreen } from './CyberDeviceScreen';

export function CyberLaptop({ position = [0, 0, 0], rotation = [0, 0, 0], isActive, renderContent }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base / Keyboard part */}
      <RoundedBox args={[3.2, 0.1, 2.2]} radius={0.05} position={[0, 0.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#383d47" roughness={0.6} metalness={0.5} />
      </RoundedBox>
      
      {/* Keyboard Indentation */}
      <mesh position={[0, 0.101, -0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 1.2]} />
        <meshStandardMaterial color="#1e2129" roughness={0.8} />
      </mesh>
      
      {/* Trackpad */}
      <mesh position={[0, 0.101, 0.7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1, 0.6]} />
        <meshStandardMaterial color="#21252e" roughness={0.6} />
      </mesh>

      {/* Screen Hinge */}
      <mesh position={[0, 0.1, -1.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.8]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.5} metalness={0.9} />
      </mesh>

      {/* Screen lid angled up */}
      <group position={[0, 0.1, -1.05]} rotation={[0.3, 0, 0]}>
        {/* Screen back */}
        <RoundedBox args={[3.2, 2.2, 0.1]} radius={0.05} position={[0, 1.1, -0.05]} castShadow receiveShadow>
          <meshStandardMaterial color="#383d47" roughness={0.6} metalness={0.5} />
        </RoundedBox>
        
        {/* Screen bezel */}
        <RoundedBox args={[3.15, 2.15, 0.01]} radius={0.02} position={[0, 1.1, 0.01]}>
          <meshStandardMaterial color="#020304" roughness={0.2} metalness={0.9} />
        </RoundedBox>
        
        {/* The actual HTML Screen content */}
        <group position={[0, 1.1, 0.015]}>
          <CyberDeviceScreen 
             title="ENDPOINT DEVICE" 
             subtitle="CORPORATE LAPTOP" 
             isActive={isActive} 
             color="#3b82f6" 
             width="600px" 
             height="400px" 
             scale={0.005}
           >
             {renderContent()}
           </CyberDeviceScreen>
        </group>
      </group>
    </group>
  );
}
