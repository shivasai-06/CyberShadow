import { useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { CyberDeviceScreen } from './CyberDeviceScreen';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CyberServerRack({ position = [0, 0, 0], rotation = [0, 0, 0], isActive, renderContent }: any) {
  const lightsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (lightsRef.current && isActive) {
      // Blink lights rapidly if active
      lightsRef.current.children.forEach((light: any, i: number) => {
        (light as any).material.emissiveIntensity = Math.sin(state.clock.elapsedTime * 10 + i) > 0 ? 2 : 0.2;
      });
    } else if (lightsRef.current) {
      lightsRef.current.children.forEach((light: any, _i: number) => {
        (light as any).material.emissiveIntensity = 0.5;
      });
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Main Rack Body */}
      <RoundedBox args={[3, 10, 3]} radius={0.1} position={[0, 5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e2129" roughness={0.5} metalness={0.6} />
      </RoundedBox>
      
      {/* Servers */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <group key={i} position={[0, 2 + i * 1.2, 1.4]}>
           <RoundedBox args={[2.8, 1, 0.4]} radius={0.05} castShadow receiveShadow>
             <meshStandardMaterial color="#2d3342" roughness={0.6} metalness={0.6} />
           </RoundedBox>
           {/* Drive bays / vents */}
           <mesh position={[-0.5, 0, 0.21]} receiveShadow>
             <planeGeometry args={[1.5, 0.6]} />
             <meshStandardMaterial color="#0a0c10" roughness={0.9} />
           </mesh>
        </group>
      ))}

      {/* Blinking Indicator Lights */}
      <group ref={lightsRef} position={[1, 2, 1.62]}>
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <mesh key={`light-${i}`} position={[0, i * 1.2, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Attached Monitor/Console displaying Cloud Screen */}
      <group position={[-2, 6, 1]} rotation={[0, -Math.PI / 4, 0]}>
         {/* Arm */}
         <mesh position={[1, 0, -0.5]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1]} />
            <meshStandardMaterial color="#222" metalness={0.8} />
         </mesh>
         {/* Screen */}
         <RoundedBox args={[2.2, 1.4, 0.1]} radius={0.05} castShadow receiveShadow>
           <meshStandardMaterial color="#202533" roughness={0.4} metalness={0.5} />
         </RoundedBox>
         <group position={[0, 0, 0.05]}>
           <CyberDeviceScreen 
             title="CLOUD INFRASTRUCTURE" 
             subtitle="DATA CENTER" 
             isActive={isActive} 
             color="#6366f1" 
             width="400px" 
             height="250px" 
             scale={0.005}
           >
             {renderContent()}
           </CyberDeviceScreen>
         </group>
      </group>
    </group>
  );
}
