// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DocumentRegistry {
    struct Activity {
        string activityType;
        string docHash;
        string metadata;
        address uploader;
        uint256 timestamp;
    }

    mapping(uint256 => Activity) private activities;
    uint256 private activityCount;

    event ActivityStored(
        uint256 indexed activityId,
        string activityType,
        string docHash,
        address indexed uploader,
        uint256 timestamp
    );

    event DocumentStored(
        uint256 indexed docId,
        string docType,
        string docHash,
        address indexed uploader,
        uint256 timestamp
    );

    function storeActivity(
        string memory _activityType,
        string memory _docHash,
        string memory _metadata
    ) public returns (uint256) {
        activityCount++;

        activities[activityCount] = Activity({
            activityType: _activityType,
            docHash: _docHash,
            metadata: _metadata,
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        emit ActivityStored(
            activityCount,
            _activityType,
            _docHash,
            msg.sender,
            block.timestamp
        );

        return activityCount;
    }

    function storeDocument(
        string memory _docType,
        string memory _docHash,
        string memory _metadata
    ) public returns (uint256) {
        uint256 activityId = storeActivity(_docType, _docHash, _metadata);
        Activity memory activity = activities[activityId];

        emit DocumentStored(
            activityId,
            activity.activityType,
            activity.docHash,
            activity.uploader,
            activity.timestamp
        );

        return activityId;
    }

    function getActivity(uint256 _activityId) public view returns (
        string memory activityType,
        string memory docHash,
        string memory metadata,
        address uploader,
        uint256 timestamp
    ) {
        require(_activityId > 0 && _activityId <= activityCount, "Invalid activity ID");

        Activity memory activity = activities[_activityId];
        return (
            activity.activityType,
            activity.docHash,
            activity.metadata,
            activity.uploader,
            activity.timestamp
        );
    }

    function getDocument(uint256 _docId) public view returns (
        string memory docType,
        string memory docHash,
        string memory metadata,
        address uploader,
        uint256 timestamp
    ) {
        return getActivity(_docId);
    }

    function getActivityCount() public view returns (uint256) {
        return activityCount;
    }

    function getDocumentCount() public view returns (uint256) {
        return activityCount;
    }
}
