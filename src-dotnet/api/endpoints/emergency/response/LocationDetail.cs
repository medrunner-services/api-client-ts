using System.Collections.Generic;

namespace MedrunnerApiClient.Api.Endpoints.Emergency.Response;

    /// <summary>
    /// A supported location from which an emergency may be submitted.
    /// </summary>
    public class LocationDetail
    {
        /// <summary>
        /// The name of this location
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The type of this location
        /// </summary>
        public LocationType Type { get; set; }

        /// <summary>
        /// Additional locations which are within this location (e.g. moons of a planet, or planets of a system)
        /// </summary>
        public List<LocationDetail> Children { get; set; }
    }

    /// <summary>
    /// The type of location.
    /// </summary>
    public enum LocationType
    {
        /// <summary>
        /// The location type is not known
        /// </summary>
        UNKNOWN,
        /// <summary>
        /// A system, e.g. Stanton
        /// </summary>
        SYSTEM,
        /// <summary>
        /// A planet, e.g. Crusader
        /// </summary>
        PLANET,
        /// <summary>
        /// A moon, e.g. Daymar
        /// </summary>
        MOON
    }
    