// Simple chatbot logic
const userInputField = document.getElementById('user-input');
const speechButton = document.getElementById('speech-button');
const sendButton = document.getElementById('send-button');
const emojiButton = document.getElementById('emoji-button');
const toggleVoiceButton = document.getElementById('toggle-voice');
const voiceResponseDiv = document.getElementById('voice-response');

const chatLog = document.getElementById('chat-log');
let isVoiceEnabled = false;
let isListening = false;
let recognizedQuestions = [];
let lastRecognizedQuestion = '';
let recognition;
let speechBuffer = '';

userInputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage();
    }
});

toggleVoiceButton.addEventListener('click', function() {
    isVoiceEnabled = !isVoiceEnabled;
    if (isVoiceEnabled) {
        toggleVoiceButton.textContent = 'Voice Enabled';
    } else {
        toggleVoiceButton.textContent = 'Toggle Voice Response';
        // Clear the voice response div when voice is disabled
        voiceResponseDiv.textContent = '';
    }
});

function toggleInteractionHistory() {
    const interactionHistoryPanel = document.querySelector('.interaction-history');
    if (interactionHistoryPanel.style.display === 'block') {
        interactionHistoryPanel.style.display = 'none';
    } else {
        interactionHistoryPanel.style.display = 'block';
    }
}

const toggleHistoryButton = document.getElementById('toggle-history-button');
let interactionHistory = [];

let isHistoryPanelOpen = false;

// Function to add an interaction to the history
function addToInteractionHistory(userInput, botResponse) {
    interactionHistory.push({ user: userInput, bot: botResponse });
}
function displayInteractionHistory() {
    const interactionHistoryPanel = document.querySelector('.interaction-history');
    interactionHistoryPanel.style.display = 'block';

	if (isHistoryPanelOpen) {
        interactionHistoryPanel.style.display = 'none';
        isHistoryPanelOpen = false;
    } else {
        interactionHistoryPanel.style.display = 'block';
        isHistoryPanelOpen = true;
    }

    // Clear the existing history list
    const interactionHistoryList = document.getElementById('interaction-history-list');
    interactionHistoryList.innerHTML = '';

    // Iterate through the interaction history and add items to the list
    for (const interaction of interactionHistory) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>User:</strong> ${interaction.user}<br><strong>Bot:</strong> ${interaction.bot}`;
        interactionHistoryList.appendChild(listItem);
    }
}

toggleHistoryButton.addEventListener('click', function () {
    // Display the interaction history when the button is clicked
    displayInteractionHistory();
});


function displayVoiceResponse(response) {
    // Display voice response if voice is enabled
    if (isVoiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(response);
        speechSynthesis.speak(utterance);
    }


    // Scroll to the bottom of the chat log
    chatLog.scrollTop = chatLog.scrollHeight;
}
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        // Set recognition properties (you can adjust these as needed)
        recognition.lang = 'en-US'; // Language for speech recognition
        recognition.continuous = true;
        
        // Function to start recognition
        function startRecognition() {
            if (!recognition) {
                initSpeechRecognition();
            }
            // Start speech recognition
            if (!isListening) {
                recognition.start();
                isListening = true;
                speechButton.innerHTML = '<i class="fas fa-microphone-slash"></i>'; // Update button text
            }
        }
        
        // Function to stop recognition
        function stopRecognition() {
            if (isListening) {
                recognition.stop();
                isListening = false;
                speechButton.innerHTML = '<i class="fas fa-microphone"></i>'; // Update button text
            }
        }
        
        // Add an event listener to the speech button to toggle recognition
        speechButton.addEventListener('click', () => {
            if (isListening) {
                stopRecognition();
            } else {
                startRecognition();
            }
        });
        
        // Add an event listener to the recognition instance for results
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            console.log("Recognized Text: ", transcript);
            speechBuffer += transcript;
            if (userInputField.value.trim() !== '') {
                userInputField.value += ' ';
            }
            // Append the recognized speech to the existing input field value
            userInputField.value = transcript;
        
            // Only proceed if the current recognized question is different from the last one
            if (transcript !== lastRecognizedQuestion) {
                // Update the last recognized question
                lastRecognizedQuestion = transcript;
        
                // Store the recognized question
                recognizedQuestions.push(transcript);
        
                // Send the message
                sendMessage();
            }
        
            lastRecognizedQuestion = '';
        
            // Reset the speech buffer for the next recognition
            speechBuffer = '';
        };
        
        // Ensure recognition starts initially
        startRecognition();
    } else {
        // Browser does not support the Web Speech API, disable the button
        speechButton.disabled = true;
        speechButton.textContent = 'Speech recognition not supported';
    }
}

initSpeechRecognition();  

// Initialize speech recognition when the page loads

const backgroundImages = [
    'underwater.jpeg',
    'mountains.jpg',
    'streets of southern france.jpeg',
    'your-background-image.jpeg',
    'lonely men.jpeg',
    'vacationhouse_chatbot images.jpeg',
    'sandpalace.jpeg'
];

function changeBackgroundImage() {
    const backgroundContainer = document.querySelector('.background-container');
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const randomImage = backgroundImages[randomIndex];
    backgroundContainer.style.backgroundImage = `url('${randomImage}')`;
}

changeBackgroundImage();

setInterval(changeBackgroundImage, Math.floor(Math.random() * 6000) + 5000);

const predefinedQA = [
    {
        question: "What is the capital of India",
        answer: "The capital of India is New Delhi."
    },
    {
        question: "what is your name",
        answer: "I am a chatbot named Gulab Jamun."
    },
    {
        question: "What is the national currency of India",
        answer: "The national currency of India is the Indian Rupee (INR)."
    },
    {
        question: "What is the population of India",
        answer: "As of my knowledge cutoff date in September 2021, India's population is over 1.3 billion people."
    },
    {
        question: "Who is the current Prime Minister of India",
        answer: "As of my knowledge cutoff date in September 2021, the Prime Minister of India is Narendra Modi."
    },
    {
        question: "Tell me about Indian cuisine.",
        answer: "Indian cuisine is known for its diversity and use of spices. It includes dishes like curry, biryani, samosas, and various regional specialties."
    },
    {
        question: "What are the major languages spoken in India?",
        answer: "India is a linguistically diverse country, but some of the major languages include Hindi, Bengali, Telugu, Marathi, Tamil, and Urdu."
    },
    {
        question: "Name a famous river in India.",
        answer: "The Ganges River, also known as the Ganga, is one of the most famous and sacred rivers in India."
    },
    {
        question: "What is Diwali?",
        answer: "Diwali, also known as the Festival of Lights, is a major Hindu festival celebrated in India and other countries. It symbolizes the victory of light over darkness."
    },
    {
        question: "Who was Mahatma Gandhi?",
        answer: "Mahatma Gandhi, also known as Bapu, was a prominent leader of the Indian independence movement against British rule. He is known for his philosophy of non-violence."
    },
    {
        question: "What is Bollywood",
        answer: "Bollywood is the informal term used to refer to the Hindi-language film industry based in Mumbai, India. It is one of the largest film industries in the world."
    },
    {
        question: "Tell me about the Indian flag.",
        answer: "The Indian national flag, also known as the tricolor, consists of horizontal stripes of saffron, white, and green. It has a blue Ashoka Chakra (wheel) in the center."
    },
    {
        question: "What is the national animal of India?",
        answer: "The national animal of India is the Bengal Tiger."
    },
    {
        question: "Name a famous monument in Jaipur, India.",
        answer: "The Hawa Mahal, also known as the Palace of Winds, is a famous monument in Jaipur, Rajasthan, India."
    },
    {
        question: "What is Holi?",
        answer: "Holi is a colorful and joyous Hindu festival celebrated in India, known as the Festival of Colors. It marks the arrival of spring."
    },
];

document.addEventListener('DOMContentLoaded', function () {
    const emojiButton = document.getElementById('emoji-button');
    const chatInput = document.getElementById('user-input');
    const picker = new EmojiPicker({ appendTo: document.body });
    const emojis = ['😊', '😍', '🤔', '😎', '🥳', '😂', '👍', '🎉', '❤️', '🙌'];

    // Event listener for emoji button click
    emojiButton.addEventListener('click', () => {
        // Clear the chat input before appending emojis
        chatInput.value = '';
        
        // Display emojis for users to choose from
        emojis.forEach(emoji => {
            const emojiElement = document.createElement('span');
            emojiElement.className = 'emoji';
            emojiElement.textContent = emoji;
            emojiElement.addEventListener('click', () => {
                chatInput.value += emoji; // Add the selected emoji to the input field
            });
            chatInput.appendChild(emojiElement);
        });
        
        // Toggle the emoji picker
        picker.togglePicker(emojiButton);
    });
});
function calculateLevenshteinDistance(a, b) {
    const dp = Array(a.length + 1)
        .fill(null)
        .map(() => Array(b.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
        dp[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[a.length][b.length];
}

function getBestMatchingQuestion(userInput) {
    const lowerCaseInput = userInput.toLowerCase();
    let bestMatch = null;
    let bestDistance = Infinity;

    for (const qa of predefinedQA) {
        const distance = calculateLevenshteinDistance(
            lowerCaseInput,
            qa.question.toLowerCase()
        );

        if (distance < bestDistance) {
            bestMatch = qa;
            bestDistance = distance;
        }
    }

    return bestMatch;
}

function getBotResponse(userInput) {
    const lowerCaseInput = userInput.toLowerCase();
    
    // Check if the user's input exactly matches the question about Holi
    if (lowerCaseInput === "what is holi?") {
        return "Holi is a colorful and joyous Hindu festival celebrated in India, known as the Festival of Colors. It marks the arrival of spring.";
    }

    // For all other questions, find the best matching question from predefinedQA
    const bestMatchingQuestion = getBestMatchingQuestion(userInput);

    if (bestMatchingQuestion && bestMatchingQuestion.question) {
        return bestMatchingQuestion.answer;
    }

    return "I didn't understand that. Please try again.";
}


userInputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage();
    }
});

sendButton.addEventListener('click', function() {
    sendMessage();
});


function sendMessage() {
    const userInput = userInputField.value.trim(); // Trim to remove leading/trailing spaces
    if (userInput === '') {
        // If userInput is empty, do not send a message
        return;
    }
    
    const timestamp = getCurrentTimestamp();

    // Display the user's message
    chatLog.innerHTML += `<div class="message user-message">
        <div class="avatar"></div>
        ${userInput}
        <span class="timestamp">${timestamp}</span>
    </div>`;

    // Process user input and generate bot response
    const botResponse = getBotResponse(userInput);
    const botTimestamp = getCurrentTimestamp();

    // Display the bot's response with the appropriate class
    chatLog.innerHTML += `<div class="message bot-message">
        <div class="avatar"></div>
        ${botResponse}
        <span class="timestamp">${botTimestamp}</span>
    </div>`;
    displayVoiceResponse(botResponse);

    // Add the interaction to the interaction history
    addToInteractionHistory(userInput, botResponse);

    // Scroll to the bottom of the chat log (optional)
    chatLog.scrollTop = chatLog.scrollHeight;

    // Clear the input field
    userInputField.value = '';
    speechBuffer = '';
}


function getCurrentTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
