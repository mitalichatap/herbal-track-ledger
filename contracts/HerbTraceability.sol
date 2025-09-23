// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title HerbTraceability - simple PoC for herbal provenance on Ethereum
/// @notice Keeps light-weight batch records and event logs; rootHash updated per event (keccak chain)
contract HerbTraceability {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct EventRecord {
        string eventId;      // human id e.g. "COL-001"
        string eventType;    // "Collection" | "Processing" | "QualityTest" | ...
        address actor;       // who added the event
        string metaCID;      // off-chain metadata (IPFS CID or storage URL)
        int256 lat;          // latitude scaled * 1e6 (avoid decimals)
        int256 lon;          // longitude scaled * 1e6
        uint256 timestamp;
        bool qualityPass;    // set for quality events (true=pass)
    }

    struct BatchSummary {
        string batchId;
        string species;
        address creator;
        bytes32 rootHash;    // evolving keccak256 hash
        uint256 createdAt;
        bool recalled;
    }

    // storage
    mapping(string => BatchSummary) private batches; // batchId -> summary
    mapping(string => uint256) public batchEventCount; // batchId -> count
    mapping(string => mapping(uint256 => EventRecord)) private batchEvents; // batchId -> index -> EventRecord
    mapping(string => mapping(address => bool)) public authorized; // batchId -> addr -> allowed

    // geofence (by species) - values scaled by 1e6
    struct GeoFence { int256 minLat; int256 maxLat; int256 minLon; int256 maxLon; bool active; }
    mapping(string => GeoFence) public geofences;

    // moisture threshold (for species) scaled by 100 (e.g., 7.2% -> 720)
    mapping(string => uint256) public moistureThreshold;

    // events
    event BatchCreated(string indexed batchId, address indexed creator);
    event EventAdded(string indexed batchId, uint256 indexed index, string eventId, string eventType, address actor);
    event AccessGranted(string indexed batchId, address indexed who);
    event BatchRecalled(string indexed batchId);

    // modifiers
    modifier batchExists(string memory batchId) {
        require(bytes(batches[batchId].batchId).length != 0, "batch not found");
        _;
    }

    modifier onlyAuthorized(string memory batchId) {
        require(authorized[batchId][msg.sender] || msg.sender == owner, "not authorized");
        _;
    }

    modifier onlyCreator(string memory batchId) {
        require(msg.sender == batches[batchId].creator, "only creator");
        _;
    }

    // Admin: set geofence for species (owner only)
    function setGeoFence(string memory species, int256 minLat, int256 maxLat, int256 minLon, int256 maxLon) external {
        require(msg.sender == owner, "owner only");
        geofences[species] = GeoFence(minLat, maxLat, minLon, maxLon, true);
    }

    // Admin: set moisture threshold (owner only). value scaled by 100 (e.g., 7.2% => 720)
    function setMoistureThreshold(string memory species, uint256 scaledValue) external {
        require(msg.sender == owner, "owner only");
        moistureThreshold[species] = scaledValue;
    }

    // Create a batch (initial collection event). lat/lon scaled by 1e6.
    function createBatch(
        string memory batchId,
        string memory species,
        string memory eventId,
        string memory metaCID,
        int256 lat,
        int256 lon
    ) external {
        require(bytes(batches[batchId].batchId).length == 0, "batch already exists");
        batches[batchId] = BatchSummary(batchId, species, msg.sender, bytes32(0), block.timestamp, false);
        authorized[batchId][msg.sender] = true;

        // add initial collection event
        _addEventInternal(batchId, eventId, "Collection", msg.sender, metaCID, lat, lon, true);

        emit BatchCreated(batchId, msg.sender);
    }

    // grant access to another address for a batch (creator only)
    function grantAccess(string memory batchId, address who) external batchExists(batchId) onlyCreator(batchId) {
        authorized[batchId][who] = true;
        emit AccessGranted(batchId, who);
    }

    // Add a general event (Processing, Transport, etc.)
    function addEvent(
        string memory batchId,
        string memory eventId,
        string memory eventType,
        string memory metaCID,
        int256 lat,
        int256 lon
    ) external batchExists(batchId) onlyAuthorized(batchId) {
        // geofence check (if active)
        GeoFence memory gf = geofences[batches[batchId].species];
        if (gf.active) {
            require(lat >= gf.minLat && lat <= gf.maxLat && lon >= gf.minLon && lon <= gf.maxLon, "outside geofence");
        }
        _addEventInternal(batchId, eventId, eventType, msg.sender, metaCID, lat, lon, true);
    }

    // Add a Quality Test (lab), includes numeric value for moisture (scaled by 100)
    function addQualityTest(
        string memory batchId,
        string memory eventId,
        string memory testType,
        uint256 numericValue, // scaled (e.g., moisture 7.2% => 720)
        string memory metaCID,
        int256 lat,
        int256 lon
    ) external batchExists(batchId) onlyAuthorized(batchId) {
        bool pass = true;

        // only implemented check for "moisture"
        if (keccak256(bytes(testType)) == keccak256(bytes("moisture"))) {
            uint256 thr = moistureThreshold[batches[batchId].species];
            if (thr > 0 && numericValue > thr) pass = false;
        }

        _addEventInternal(batchId, eventId, testType, msg.sender, metaCID, lat, lon, pass);
    }

    // internal event adder: updates rootHash = keccak(prevRoot, metaCID, timestamp)
    function _addEventInternal(
        string memory batchId,
        string memory eventId,
        string memory eventType,
        address actor,
        string memory metaCID,
        int256 lat,
        int256 lon,
        bool qualityPass
    ) internal {
        uint256 idx = batchEventCount[batchId];
        batchEvents[batchId][idx] = EventRecord(eventId, eventType, actor, metaCID, lat, lon, block.timestamp, qualityPass);
        batchEventCount[batchId] = idx + 1;

        // update rootHash
        bytes32 prev = batches[batchId].rootHash;
        if (prev == bytes32(0)) {
            batches[batchId].rootHash = keccak256(abi.encodePacked(metaCID, block.timestamp));
        } else {
            batches[batchId].rootHash = keccak256(abi.encodePacked(prev, metaCID, block.timestamp));
        }

        emit EventAdded(batchId, idx, eventId, eventType, actor);
    }

    // Get basic batch summary
    function getBatchSummary(string memory batchId) external view batchExists(batchId) returns (
        string memory species,
        address creator,
        bytes32 rootHash,
        uint256 createdAt,
        bool recalled,
        uint256 eventsCount
    ) {
        BatchSummary storage b = batches[batchId];
        return (b.species, b.creator, b.rootHash, b.createdAt, b.recalled, batchEventCount[batchId]);
    }

    // Get a specific event by index
    function getEvent(string memory batchId, uint256 index) external view batchExists(batchId) returns (
        string memory eventId,
        string memory eventType,
        address actor,
        string memory metaCID,
        int256 lat,
        int256 lon,
        uint256 timestamp,
        bool qualityPass
    ) {
        require(index < batchEventCount[batchId], "index out of range");
        EventRecord storage e = batchEvents[batchId][index];
        return (e.eventId, e.eventType, e.actor, e.metaCID, e.lat, e.lon, e.timestamp, e.qualityPass);
    }

    // recall a batch (creator only)
    function recallBatch(string memory batchId) external batchExists(batchId) onlyCreator(batchId) {
        batches[batchId].recalled = true;
        emit BatchRecalled(batchId);
    }
}
