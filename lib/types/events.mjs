import {} from "./main.mjs";
/**
 *
 */
export const EVENTS_PREFIX = 'carmel';
/**
 *
 */
export var EventChannel;
(function (EventChannel) {
    EventChannel["Swarm"] = "swarm";
})(EventChannel || (EventChannel = {}));
/**
 *
 */
export var EventType;
(function (EventType) {
    EventType["SwarmPresence"] = "swarm/presence";
})(EventType || (EventType = {}));
