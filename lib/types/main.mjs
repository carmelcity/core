import {} from 'interface-blockstore';
import {} from 'interface-datastore';
/**
 *
 */
export var NodeType;
(function (NodeType) {
    NodeType[NodeType["Relay"] = 1] = "Relay";
    NodeType[NodeType["Sentinel"] = 2] = "Sentinel";
    NodeType[NodeType["Browser"] = 3] = "Browser";
})(NodeType || (NodeType = {}));
