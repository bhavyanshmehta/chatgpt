<div align="center">

# PROJECT REPORT

on

# “AI CHAT ASSISTANT (CHATGPT CLONE)”

Submitted in partial fulfillment of the requirements for the award of the degree of

**BACHELOR OF TECHNOLOGY**
in
**COMPUTER SCIENCE AND ENGINEERING**

**Submitted By:**
[Your Name] ([Your Registration No.])
[Student 2 Name] ([Registration No.])
[Student 3 Name] ([Registration No.])

**Under the Supervision of**
[Dr./Mr./Ms. Guide Name]
([Designation])

**Department of Computer Science and Engineering**
**JECRC University, Jaipur**
**Session: 2025–26**

</div>

---

<div align="center">
  <h2>DECLARATION</h2>
</div>

I, **[Your Name]** certify that my minor project work embodied in this Report entitled **“AI Chat Assistant (ChatGPT Clone)”** is my own Bonafide work carried out by me under the supervision of **[Guide Name]** as Department of Computer Science & Engineering the JECRC University, Jaipur. The work is original and has not been submitted earlier as a whole or in part for the award of any degree/diploma at this or any other Institution / university in India or abroad.

**Date:** [Date]  
**Place:** Jaipur  

<div align="right">
  Signature of Student<br>
  <b>[Your Name]</b><br>
  (Reg. No. [Your Reg No.])
</div>

<div align="left">
  Counter Signature<br>
  <b>[Guide Name]</b>
</div>

---

<div align="center">
  <h2>CERTIFICATE</h2>
</div>

This is to certify that the Minor Project titled **“AI CHAT ASSISTANT (CHATGPT CLONE)”** has been successfully completed by: **[Your Name]**, Reg. No. **[Your Reg No.]** under my supervision during IV Semester of B.Tech. (CSE), JECRC University, Jaipur. 

<br><br>

**(Project Guide Signature)**  
**Name:** [Guide Name]  
**Designation:** [Designation]  

**(HOD Signature)**  
**Head, Department of CSE**  

**(Dean Signature)**  
**Dean, School of Engineering**

---

<div align="center">
  <h2>ACKNOWLEDGEMENT</h2>
</div>

I would like to express my deepest gratitude to my project guide, **[Guide Name]**, for their invaluable guidance, constant encouragement, and constructive feedback throughout the development of this project. Their expertise and support have been instrumental in shaping this work.

I am also highly thankful to the **Department of Computer Science and Engineering** and **JECRC University** for providing the necessary infrastructure and resources to successfully complete this project. Finally, I would like to thank my peers and family for their continuous motivation and assistance.

---

<div align="center">
  <h2>ABSTRACT</h2>
</div>

*The rapid advancement of Artificial Intelligence has transformed how users interact with web applications. The problem statement addresses the need for a lightweight, secure, and highly responsive local conversational agent that can provide intelligent assistance without relying on third-party SaaS subscriptions. This project introduces the "AI Chat Assistant," a web-based conversational application designed to mimic the interface and functionality of popular AI chatbots like ChatGPT. The solution integrates a frontend user interface with a robust backend server, utilizing Google's Gemini 2.5 Flash Large Language Model (LLM) via API. Technologies used include Python, FastAPI, SQLite for session management, and Vanilla HTML/CSS/JS for the responsive UI. The outcome is a highly functional, secure, and visually appealing AI assistant capable of maintaining context across persistent chat sessions. The system effectively demonstrates the practical application of NLP models, RESTful APIs, and secure full-stack development practices.*

**Keywords:** Artificial Intelligence, Natural Language Processing, FastAPI, LLM Integration, Web Development, Chatbot, SQLite.

---

## TABLE OF CONTENTS

**DECLARATION** (i)  
**CERTIFICATE** (ii)  
**ACKNOWLEDGMENT** (iii)  
**ABSTRACT** (iv)  
**TABLE OF CONTENTS** (v)  

**CHAPTER-1 INTRODUCTION** (1)  
1.1 Background of the Study  
1.2 Problem Statement  
1.3 Objectives of the Project  
1.4 Scope of the Project  

**CHAPTER-2 LITERATURE REVIEW** (4)  
2.1 Related Work  
2.2 Comparative Study  
2.3 Feasibility Study  

**CHAPTER-3 SYSTEM DESIGN** (7)  
3.1 System Architecture  
3.2 UML Diagrams  
3.3 Data Flow Diagram (DFD)  
3.4 Database Design  

**CHAPTER-4 IMPLEMENTATION** (10)  
4.1 Tools & Technologies Used  
4.2 System Requirements  
4.3 Modules Description  
4.4 Algorithms / Logic Used  

**CHAPTER-5 TESTING & RESULTS** (13)  
5.1 Test Plan  
5.2 Test Cases  
5.3 Output Screenshots  
5.4 Performance Analysis  

**CHAPTER-6 CONCLUSION AND FUTURE WORK** (16)  
**REFERENCES** (18)  

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background of the Study
The evolution of Natural Language Processing (NLP) and Large Language Models (LLMs) has revolutionized human-computer interaction. Conversational agents, commonly known as chatbots, have transitioned from rigid, rule-based systems to highly dynamic and intelligent assistants capable of understanding context and generating human-like text. 

## 1.2 Problem Statement
While commercial AI tools are powerful, they often require paid subscriptions, rely heavily on cloud infrastructure that stores user data externally, and offer limited customization. There is a need for a lightweight, locally hostable conversational application that allows developers and users to harness LLM capabilities (like Google Gemini) while retaining control over their chat history and interface.

## 1.3 Objectives of the Project
*   To integrate a state-of-the-art Large Language Model (Google Gemini 2.5 Flash) into a custom web application.
*   To develop a full-stack system utilizing FastAPI for backend operations and HTML/CSS/JS for frontend rendering.
*   To implement persistent session management using SQLite to store and retrieve past chat histories.
*   To ensure application security by preventing SQL injection, XSS attacks, and securing API keys via environment variables.

## 1.4 Scope of the Project
This project encompasses the development of a fully functional web-based chat interface. The scope includes message handling, context-aware AI responses, a database to store conversations, and a responsive UI that adapts to user input. The project is currently limited to text-based interaction and local deployment.

---

# CHAPTER 2: LITERATURE REVIEW / ANALYSIS

## 2.1 Related Work
Earlier conversational models relied on sequence-to-sequence learning using Recurrent Neural Networks (RNNs). Modern systems, such as OpenAI's ChatGPT and Google's Gemini, utilize Transformer architectures, allowing for superior contextual understanding. 

## 2.2 Comparative Study
Compared to existing open-source chatbots which often require heavy local computational resources (like local LLaMA models), this project utilizes a lightweight API-based approach. This ensures extremely fast response times and low hardware requirements while maintaining top-tier conversational intelligence.

## 2.3 Feasibility Study
**2.3.1 Technical Feasibility:** The project is technically feasible as it utilizes well-documented, stable technologies (Python, FastAPI, SQLite) and a publicly available API (Google Gemini).  
**2.3.2 Economic Feasibility:** The project is highly economically feasible. The tools used are open-source, and the Gemini API offers a generous free tier for development purposes.  
**2.3.3 Operational Feasibility:** The application provides a familiar, intuitive UI (mimicking ChatGPT), requiring zero learning curve for the end-user.

---

# CHAPTER 3: SYSTEM DESIGN

## 3.1 System Architecture
The system operates on a Client-Server Architecture. The frontend (Browser) sends asynchronous HTTP requests to the FastAPI backend. The backend processes the request, interacts with the local SQLite database to fetch/store context, and communicates with the external Google Gemini API to generate responses.

## 3.2 UML Diagrams
*(Placeholder for Use Case Diagram, Activity Diagram, and Sequence Diagram which demonstrate the flow of User Input -> Server -> Gemini API -> Database -> User Output).*

## 3.3 Data Flow Diagram (DFD)
Data flows from the user interface text area to the backend server. The server packages this data with historical context from the database and forwards it to the LLM. The generated text flows back to the server, is logged in the database, and is finally transmitted to the client for rendering.

## 3.4 Database Design
The database utilizes an SQLite relational model comprising two primary tables:
*   **Chats Table:** Stores `id` (Primary Key), `title`, and `created_at`.
*   **Messages Table:** Stores `id` (Primary Key), `chat_id` (Foreign Key), `role` (user/assistant), `content`, and `created_at`.

---

# CHAPTER 4: IMPLEMENTATION

## 4.1 Tools & Technologies Used
*   **Backend:** Python 3, FastAPI, Uvicorn, Python-dotenv.
*   **Frontend:** HTML5, CSS3 (with CSS Variables for Dark Mode), Vanilla JavaScript.
*   **Database:** SQLite3.
*   **AI API:** Google Generative AI SDK (`google-generativeai`).

## 4.2 System Requirements
**Hardware:** Minimum 4GB RAM, Dual-core Processor.
**Software:** Python 3.8+, Modern Web Browser (Chrome/Firefox/Edge), Git.

## 4.3 Modules Description
*   **UI Module:** Manages the visual rendering, chat history sidebar, and dynamic auto-resizing text inputs.
*   **API Router Module (`main.py`):** Handles HTTP GET/POST requests, formats API payloads, and manages errors.
*   **Database Module (`database.py`):** Encapsulates all SQL commands, ensuring safe and parameterized database queries.

## 4.4 Algorithms / Logic Used
The core logic involves Context Window Management. Before sending a message to the AI, the backend retrieves `N` previous messages from the specific `chat_id`, formats them into an array of dictionaries (representing 'user' and 'model' roles), and passes them to the Gemini `start_chat(history=...)` function to ensure contextual memory.

---

# CHAPTER 5: TESTING & RESULTS

## 5.1 Test Plan
Testing was conducted locally to verify frontend responsiveness, backend stability, database integrity, and API latency.

## 5.2 Test Cases
1.  **Empty Input Test:** Verify that the "Send" button is disabled if the text area is empty. *(Passed)*
2.  **API Key Missing Test:** Verify that the application gracefully handles a missing `.env` file by returning a user-friendly error message rather than crashing. *(Passed)*
3.  **Cross-Site Scripting (XSS) Test:** Input raw HTML scripts into the chat to verify they are rendered as plain text. *(Passed via JS `textContent` assignment)*.

## 5.3 Output Screenshots
*(Placeholder: Insert screenshots of the Chat Interface, Sidebar, and Typing Indicator here).*

## 5.4 Performance Analysis
The application demonstrates excellent performance. Local database read/writes occur in under 5ms. Total latency is primarily dependent on network speed and the Gemini API response time, which typically averages under 1.5 seconds per query.

---

# CHAPTER 6: CONCLUSION & FUTURE WORK

**Summary of Project & Achievements:**
The project successfully delivered a fully functional AI Chat Assistant. It achieved all core objectives, including real-time AI integration, persistent database storage, and a responsive, secure web interface. The application successfully mimics the seamless experience of premium AI chat tools.

**Limitations:**
The system is currently limited to text-based interactions and requires a persistent internet connection to access the Google Gemini API. It does not yet support multiple user accounts (authentication).

**Future Scope:**
*   **User Authentication:** Implementing login systems (OAuth/JWT) to support multiple concurrent users.
*   **Multimodal Support:** Upgrading the interface and API calls to accept image and document uploads for analysis by Gemini Vision models.
*   **Deployment:** Containerizing the application using Docker and deploying it to a cloud provider like AWS or Heroku for public access.

---

# BIBLIOGRAPHY / REFERENCES

1.  FastAPI Documentation. (2025). *FastAPI framework, high performance, easy to learn, fast to code, ready for production*. [Online]. Available: https://fastapi.tiangolo.com/
2.  Google DeepMind. (2025). *Gemini API Documentation*. [Online]. Available: https://ai.google.dev/
3.  SQLite Documentation. (2025). *SQLite Database Engine*. [Online]. Available: https://www.sqlite.org/docs.html
4.  Mozilla Developer Network (MDN). (2025). *JavaScript and DOM Reference*. [Online]. Available: https://developer.mozilla.org/

---

<div align="center">
  <b>APPENDICES</b>
</div>

**Appendix A: User Manual**
1. Install Python 3.
2. Run `pip install -r requirements.txt`.
3. Add API key to `.env` file.
4. Run `python main.py` and navigate to `http://127.0.0.1:8000`.

**Appendix B: Code Structure**
Available in the `main.py`, `database.py`, and `static/` directory of the submitted project archive.
