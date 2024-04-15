/**
 * A supported location from which an emergency may be submitted.
 * */
export default interface LocationDetail {
  /**
   * The name of this location
   * */
  name: string;

  /**
   * The type of this location
   * */
  type: LocationType;

  /**
   * Additional locations which are within this location (e.g. moons of a planet, or planets of a system)
   * */
  children: LocationDetail[];
}

/**
 * The type of location.
 * */
export enum LocationType {
  /**
   * The location type is not known
   * */
  UNKNOWN,
  /**
   * A system, e.g. Stanton
   * */
  SYSTEM,
  /**
   * A planet, e.g. Crusader
   * */
  PLANET,
  /**
   * A moon, e.g. Daymar
   * */
  MOON,
}
