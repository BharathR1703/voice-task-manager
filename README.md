# 🎤 Voice-Enabled Task Tracking Application

A modern task tracking dashboard inspired by Linear, enhanced with a natural voice-based task creation feature that intelligently parses spoken input into structured task fields.

Users can simply speak their task like a reminder — the system extracts the task **Title, Description, Due Date, Priority, and Status**, allows review/editing, and then saves it to the task board.

---

## ✨ Features

### 📌 Core Task Management
- Create tasks manually or using voice input
- View tasks in **Kanban board** or **List view**
- Update any task field
- Drag and drop tasks across **To Do, In Progress, Done**
- Delete tasks with confirmation
- **Search and filter** by title, status, priority, or due date

### 🎤 Voice Task Creation (Key Differentiator)
- Start/stop recording using microphone button
- Convert speech to text in browser
- Parse natural text using AI or local heuristics
- Preview extracted fields in a review modal before saving
- Raw transcript shown alongside parsed fields

---

## 🧰 Tech Stack

| Layer | Technology |
|------|-------------|
| Frontend | React (Vite recommended), Tailwind CSS, @dnd-kit/core |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB (Mongoose ORM) |
| AI Parsing | OpenAI Chat Completions API (with fallback using `chrono-node`) |
| Testing | Jest, Supertest |

---

## 🚀 Project Setup

### ✅ Prerequisites
- Node.js `>= 18.x`
- MongoDB (Local or Atlas)
- VS Code with GitHub Copilot or Cursor (optional but helpful)
- (Optional but Recommended) **OpenAI API Key for best transcript parsing**

---

### ⚙️ Installation

```bash
# Clone the repo
git clone <YOUR_GITHUB_LINK>

# Install Frontend Dependencies
cd frontend
npm install

# Install Backend Dependencies
cd ../backend
npm install
