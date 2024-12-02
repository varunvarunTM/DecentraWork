// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceMarketplace {
    // Enum to track job status
    enum JobStatus {
        CREATED,
        PROPOSED,
        IN_PROGRESS,
        COMPLETED,
        CLOSED
    }

    // Struct to represent a job listing
    struct Job {
        uint256 id;
        address client;
        string title;
        string description;
        uint256 budget;
        uint256 deadline;
        JobStatus status;
        address selectedFreelancer;
    }

    // Struct to represent a freelancer's proposal
    struct Proposal {
        address freelancer;
        uint256 proposedPayment;
        string proposalDetails;
        bool isAccepted;
    }

    // Struct to represent a rating and review
    struct Review {
        uint8 rating;
        string reviewText;
        address reviewer;
    }

    // Mapping to store jobs
    mapping(uint256 => Job) public jobs;
    
    // Mapping to store proposals for each job
    mapping(uint256 => Proposal[]) public jobProposals;
    
    // Mapping to store reviews for users
    mapping(address => Review[]) public userReviews;

    // Counter for job IDs
    uint256 public jobCounter;

    // Events for important actions
    event JobCreated(uint256 jobId, address client, string title, uint256 budget);
    event ProposalSubmitted(uint256 jobId, address freelancer, uint256 proposedPayment);
    event ProposalAccepted(uint256 jobId, address freelancer);
    event JobCompleted(uint256 jobId, address freelancer);
    event PaymentReleased(uint256 jobId, address freelancer, uint256 amount);
    event ReviewSubmitted(address reviewed, address reviewer, uint8 rating);

    // Modifier to check if caller is the job client
    modifier onlyJobClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Only job client can perform this action");
        _;
    }

    // Modifier to check if caller is the selected freelancer
    modifier onlySelectedFreelancer(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].selectedFreelancer, "Only selected freelancer can perform this action");
        _;
    }

    // Create a new job listing
    function createJob(
        string memory _title, 
        string memory _description, 
        uint256 _budget, 
        uint256 _deadline
    ) external payable {
        require(_budget > 0, "Budget must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(msg.value == _budget, "Sent amount must match job budget");

        jobCounter++;
        jobs[jobCounter] = Job({
            id: jobCounter,
            client: msg.sender,
            title: _title,
            description: _description,
            budget: _budget,
            deadline: _deadline,
            status: JobStatus.CREATED,
            selectedFreelancer: address(0)
        });

        emit JobCreated(jobCounter, msg.sender, _title, _budget);
    }

    // Submit a proposal for a job
    function submitProposal(
        uint256 _jobId, 
        uint256 _proposedPayment, 
        string memory _proposalDetails
    ) external {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.CREATED, "Job is no longer accepting proposals");
        require(_proposedPayment <= job.budget, "Proposed payment exceeds job budget");

        Proposal memory newProposal = Proposal({
            freelancer: msg.sender,
            proposedPayment: _proposedPayment,
            proposalDetails: _proposalDetails,
            isAccepted: false
        });

        jobProposals[_jobId].push(newProposal);

        emit ProposalSubmitted(_jobId, msg.sender, _proposedPayment);
    }

    // Accept a proposal for a job
    function acceptProposal(uint256 _jobId, address _freelancer) external onlyJobClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.CREATED, "Job is not in a state to accept proposals");

        Proposal[] storage proposals = jobProposals[_jobId];
        bool proposalFound = false;

        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].freelancer == _freelancer) {
                proposals[i].isAccepted = true;
                job.selectedFreelancer = _freelancer;
                job.status = JobStatus.IN_PROGRESS;
                proposalFound = true;
                break;
            }
        }

        require(proposalFound, "Proposal not found");

        emit ProposalAccepted(_jobId, _freelancer);
    }

    // Mark job as completed by freelancer
    function markJobCompleted(uint256 _jobId) external onlySelectedFreelancer(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.IN_PROGRESS, "Job is not in progress");
        require(block.timestamp <= job.deadline, "Job deadline has passed");

        job.status = JobStatus.COMPLETED;

        emit JobCompleted(_jobId, msg.sender);
    }

    // Release payment to freelancer
    function releasePayment(uint256 _jobId) external onlyJobClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.COMPLETED, "Job is not completed");

        uint256 paymentAmount = job.budget;
        job.status = JobStatus.CLOSED;

        // Transfer payment to freelancer
        payable(job.selectedFreelancer).transfer(paymentAmount);

        emit PaymentReleased(_jobId, job.selectedFreelancer, paymentAmount);
    }

    // Submit a review and rating
    function submitReview(
        address _reviewedUser, 
        uint8 _rating, 
        string memory _reviewText
    ) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        Review memory newReview = Review({
            rating: _rating,
            reviewText: _reviewText,
            reviewer: msg.sender
        });

        userReviews[_reviewedUser].push(newReview);

        emit ReviewSubmitted(_reviewedUser, msg.sender, _rating);
    }

    // Get average rating for a user
    function getUserAverageRating(address _user) external view returns (uint256) {
        Review[] memory reviews = userReviews[_user];
        if (reviews.length == 0) return 0;

        uint256 totalRating = 0;
        for (uint i = 0; i < reviews.length; i++) {
            totalRating += reviews[i].rating;
        }

        return totalRating / reviews.length;
    }

    // Fallback function to handle unexpected payments
    receive() external payable {}
}