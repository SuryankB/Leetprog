document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyCount = document.getElementById("easy-count");
    const mediumCount = document.getElementById("medium-count");
    const hardCount = document.getElementById("hard-count");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        if (!regex.test(username)) {
            alert("Invalid Username");
            return false;
        }
        return true;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const url = "http://localhost:5000/leetcode";
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        query userSessionProgress($username: String!) {
                            allQuestionsCount {
                                difficulty
                                count
                            }
                            matchedUser(username: $username) {
                                submitStats {
                                    acSubmissionNum {
                                        difficulty
                                        count
                                    }
                                }
                            }
                        }
                    `,
                    variables: { username }
                }),
            };

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const parsedData = await response.json();
            console.log("User Data: ", parsedData);

            displayUserData(parsedData);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch user data.");
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, countElement, progressElement) {
        const progressDegree = (solved / total) * 100;
        progressElement.style.background = `conic-gradient(#FAD02E ${progressDegree}%, #3beb73  0%)`;
        countElement.textContent = `${solved} / ${total}`;
    }

    function displayUserData(parsedData) {
        const totalEasy = parsedData.data.allQuestionsCount[1].count;
        const totalMedium = parsedData.data.allQuestionsCount[2].count;
        const totalHard = parsedData.data.allQuestionsCount[3].count;

        const solvedEasy = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMedium = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHard = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedEasy, totalEasy, easyCount, easyProgressCircle);
        updateProgress(solvedMedium, totalMedium, mediumCount, mediumProgressCircle);
        updateProgress(solvedHard, totalHard, hardCount, hardProgressCircle);
    }

    searchButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
