export function CyberEnvironment() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#11141c" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Background Wall */}
      <mesh position={[0, 10, -15]} receiveShadow>
        <planeGeometry args={[100, 40]} />
        <meshStandardMaterial color="#181c26" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Lighting Setup */}
      <ambientLight intensity={1.5} />
      <hemisphereLight args={['#475b7a', '#11141c', 1.0]} />
      
      {/* Main Key Light */}
      <directionalLight 
        position={[10, 20, 15]} 
        intensity={2.5} 
        color="#ffffff" 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20, 0.1, 100]} />
      </directionalLight>

      {/* Soft Fill Light */}
      <directionalLight position={[-15, 10, 10]} intensity={1.2} color="#8b5cf6" />
      
      {/* Front/Accent Light */}
      <pointLight position={[0, 5, 10]} intensity={1.5} color="#06b6d4" distance={30} />
      
      <fog attach="fog" args={['#060a14', 20, 60]} />
    </group>
  );
}
