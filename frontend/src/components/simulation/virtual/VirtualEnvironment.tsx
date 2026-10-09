import { Grid, Sparkles, Environment, Box } from '@react-three/drei';

export function VirtualEnvironment() {
  return (
    <>
      <color attach="background" args={['#010205']} />
      {/* Fog to hide the void in the background and add depth */}
      <fog attach="fog" args={['#010205', 10, 45]} />

      {/* Ambient and directional lights for a dramatic cyber feel */}
      <ambientLight intensity={0.15} color="#4f8aff" />
      <directionalLight position={[10, 15, 5]} intensity={1.5} color="#3b82f6" />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[0, -2, 0]} intensity={1.5} color="#10b981" distance={30} />

      {/* Subtle Rim/Backlight to highlight architecture */}
      <spotLight position={[0, 5, -20]} intensity={2} color="#0ea5e9" angle={1} penumbra={1} distance={40} />

      <Environment preset="night" environmentIntensity={0.2} />

      {/* Dark Floor Plane for solid ground feeling */}
      <mesh position={[0, -4.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#02040a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Futuristic Floor Grid */}
      <Grid 
        position={[0, -4, 0]} 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#061224" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#0a1f3d" 
        fadeDistance={45} 
        fadeStrength={1} 
      />

      {/* Architectural Elements (Distant Pillars) */}
      {[...Array(6)].map((_, i) => (
        <group key={`pillar-L-${i}`} position={[-15, 0, -20 + i * 5]}>
          <Box args={[0.5, 20, 0.5]} position={[0, 6, 0]}>
            <meshStandardMaterial color="#060c17" roughness={0.8} metalness={0.5} />
          </Box>
          {/* Subtle glowing strip on pillar */}
          <Box args={[0.1, 10, 0.6]} position={[0.2, 5, 0]}>
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.15} />
          </Box>
        </group>
      ))}
      {[...Array(6)].map((_, i) => (
        <group key={`pillar-R-${i}`} position={[15, 0, -20 + i * 5]}>
          <Box args={[0.5, 20, 0.5]} position={[0, 6, 0]}>
            <meshStandardMaterial color="#060c17" roughness={0.8} metalness={0.5} />
          </Box>
          <Box args={[0.1, 10, 0.6]} position={[-0.2, 5, 0]}>
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.15} />
          </Box>
        </group>
      ))}

      {/* Background Translucent Panels */}
      <mesh position={[0, 0, -25]}>
        <planeGeometry args={[40, 15]} />
        <meshBasicMaterial color="#040b17" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 5, -24.5]}>
        <planeGeometry args={[38, 0.1]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, -5, -24.5]}>
        <planeGeometry args={[38, 0.1]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>

      {/* Overhead structural elements */}
      <Grid 
        position={[0, 12, 0]} 
        args={[50, 50]} 
        cellSize={2} 
        cellThickness={1} 
        cellColor="#020812" 
        sectionSize={10} 
        sectionThickness={1.5} 
        sectionColor="#040b17" 
        fadeDistance={30} 
        fadeStrength={1} 
        rotation={[Math.PI, 0, 0]}
      />

      {/* Ambient floating particles - slightly reduced and spaced out */}
      <Sparkles count={100} scale={30} size={1.2} speed={0.1} opacity={0.2} color="#0ea5e9" position={[0, 2, -5]} />
      <Sparkles count={40} scale={25} size={1.5} speed={0.05} opacity={0.1} color="#8b5cf6" position={[0, 4, 5]} />
    </>
  );
}
