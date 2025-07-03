#!/bin/bash

# Auto parts demo images download script
cd public/demo-images/auto-parts

# Create sample images using different placeholder services
declare -a parts=(
  "engine-block" "brake-pad" "spark-plug" "air-filter" "oil-filter"
  "battery" "alternator" "starter-motor" "radiator" "water-pump"
  "timing-belt" "fuel-pump" "shock-absorber" "brake-disc" "clutch"
  "transmission" "differential" "cv-joint" "ball-joint" "tie-rod"
  "control-arm" "sway-bar" "strut" "spring" "bearing"
  "gasket" "seal" "hose" "belt" "chain"
  "piston" "cylinder" "valves" "cam-shaft" "crank-shaft"
  "turbo-charger" "intercooler" "manifold" "exhaust-pipe" "muffler"
  "catalytic-converter" "oxygen-sensor" "mass-airflow-sensor" "throttle-body" "injector"
  "ignition-coil" "distributor" "rotor" "pcv-valve" "thermostat"
  "headlight" "taillight" "fog-light" "mirror" "wiper-blade"
  "door-handle" "window-motor" "lock-actuator" "seat-belt" "airbag"
  "dashboard" "speedometer" "steering-wheel" "gear-shift" "pedal"
  "floor-mat" "seat-cover" "sun-visor" "glove-box" "console"
  "bumper" "fender" "hood" "trunk" "door-panel"
  "grille" "emblem" "trim" "molding" "spoiler"
  "tire" "wheel" "rim" "hub-cap" "valve-stem"
  "brake-line" "fuel-line" "coolant-hose" "vacuum-hose" "wiring-harness"
  "fuse" "relay" "switch" "sensor" "actuator"
  "pump" "compressor" "fan" "motor" "solenoid"
  "bracket" "mount" "bushing" "clip" "fastener"
  "screw" "bolt" "nut" "washer" "pin"
  "lubricant" "coolant" "brake-fluid" "power-steering-fluid" "gear-oil"
)

# Download images with different services for variety
for i in "${!parts[@]}"; do
  part_name="${parts[$i]}"
  img_number=$((i + 1))
  
  # Use different image sizes and services for variety
  case $((i % 4)) in
    0)
      curl -s "https://picsum.photos/400/300?random=$img_number" -o "${part_name}-${img_number}.jpg"
      ;;
    1)
      curl -s "https://picsum.photos/450/350?random=$img_number" -o "${part_name}-${img_number}.jpg"
      ;;
    2)
      curl -s "https://picsum.photos/500/400?random=$img_number" -o "${part_name}-${img_number}.jpg"
      ;;
    3)
      curl -s "https://picsum.photos/400/320?random=$img_number" -o "${part_name}-${img_number}.jpg"
      ;;
  esac
  
  echo "Downloaded: ${part_name}-${img_number}.jpg"
  sleep 0.2  # Small delay to avoid overwhelming the service
done

echo "Downloaded ${#parts[@]} auto parts images!"
