// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract IdeaChain {
    struct Idea {
        uint256 id;
        string title;
        string description;
        address author;
        uint256 timestamp;
    }

    Idea[] private ideas;

    event IdeaRegistered(
        uint256 id,
        string title,
        address author
    );

    function registerIdea(
        string memory _title,
        string memory _description
    ) public {
        require(bytes(_title).length > 0, "Title cannot be empty");

        ideas.push(
            Idea({
                id: ideas.length + 1,
                title: _title,
                description: _description,
                author: msg.sender,
                timestamp: block.timestamp
            })
        );

        emit IdeaRegistered(
            ideas.length,
            _title,
            msg.sender
        );
    }

    function getIdeasCount() public view returns (uint256) {
        return ideas.length;
    }

    function getIdea(uint256 _index)
        public
        view
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address author,
            uint256 timestamp
        )
    {
        require(_index < ideas.length, "Idea does not exist");

        Idea memory idea = ideas[_index];

        return (
            idea.id,
            idea.title,
            idea.description,
            idea.author,
            idea.timestamp
        );
    }
}
