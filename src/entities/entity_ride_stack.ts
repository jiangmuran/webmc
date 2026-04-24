export interface Rideable {
  id: string;
  maxPassengers: number;
  passengerIds: readonly string[];
}

export function canMount(vehicle: Rideable, passengerId: string): boolean {
  if (vehicle.passengerIds.includes(passengerId)) return false;
  return vehicle.passengerIds.length < vehicle.maxPassengers;
}

export function mount(vehicle: Rideable, passengerId: string): Rideable {
  if (!canMount(vehicle, passengerId)) return vehicle;
  return { ...vehicle, passengerIds: [...vehicle.passengerIds, passengerId] };
}

export function dismount(vehicle: Rideable, passengerId: string): Rideable {
  return {
    ...vehicle,
    passengerIds: vehicle.passengerIds.filter((p) => p !== passengerId),
  };
}

export function controllingPassenger(v: Rideable): string | undefined {
  return v.passengerIds[0];
}
